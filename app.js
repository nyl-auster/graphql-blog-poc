const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const fse = require('fs-extra');
const graphql = require('graphql')
const _ = require('lodash')

class App {

  constructor() {
    this.modules = []
    this.graphQLSchema = {}
    this.server = express()
    this.config = this.parseConfig()
  }

  parseConfig(key = null) {
    let envConfig = {}
    console.log('load config from file')
    const env = process.env.NODE_ENV
    const config = require("./config")
    envConfig = config['*']
    for (const property in config[env]) {
      envConfig[property] = config[env][property]
    }
    return key ? envConfig[key] : envConfig
  }

  async start() {
    this.modules = await this.discoverModules()
    this.graphQLSchema = this.buildGraphQLSchemaFromModules(this.modules)
    await this.startDatabase()
    this.startServer(this.graphQLSchema)
  }

  /**
  * Collect graphQL schema definition from modules
  * to create a graphQL schema
  */
  buildGraphQLSchemaFromModules(modules) {
    // collect query fields from modules
    let queryFields = {}
    for (const moduleId in modules) {
      for (let filepath of modules[moduleId].plugins.graphQL) {
        filepath = ['.', this.config.modulesPath, moduleId, filepath].join('/')
        let schemaFragment = require(filepath)
        for (const property in schemaFragment.queryFields) {
          queryFields[property] = schemaFragment.queryFields[property]
        }
      }
    }

    // Entry points : les "resolvers"
    const queryType = new graphql.GraphQLObjectType({
      name: 'Query',
      // les clefs de "fields" sont les points d'entrée pour notre API en http GET
      fields: queryFields
    });

    const schema = new graphql.GraphQLSchema({
      query: queryType
    })

    return schema
  }

  startDatabase() {
    console.log("connecting to mongoDB database ... ")
    mongoose.Promise = global.Promise
    return mongoose.connect(this.config.mongodb_uri).then(() => {
      console.log("connected successfully to 'mongodb://localhost/yineo' ! ")
    }).catch((e) => {
      console.log(e)
    })
  }

  startServer(graphQLSchema) {
    this.server.use('/graphql', graphqlHTTP({
      schema: graphQLSchema,
      rootValue: global,
      graphiql: true,
    }))
    this.server.listen(this.config.httpServerPort)
    console.log("Http server is listening on port " + this.config.httpServerPort)
  }

  async discoverModules(callback) {
    const modules = {}
    const items = await fse.readdir(this.config.modulesPath)
    for (var i=0; i<items.length; i++) {
      const modulePath = this.config.modulesPath + "/" + items[i]
      const module = require("./" + modulePath)
      module.path = modulePath
      modules[items[i]] = module
    }
    return modules
  }

}

module.exports = new App()
