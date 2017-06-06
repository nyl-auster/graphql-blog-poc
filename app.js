const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const fse = require('fs-extra');
const graphql = require('graphql')
const config = require('./config.json')[process.env.NODE_ENV || 'dev'];
console.log(config)

class App {

  constructor() {
    this.modulesPath = "modules"
    this.modules = []
    this.graphQLSchema = {}
    this.server = express()
  }

  // run application
  start() {
    this.discoverModules()
    .then(modules => {
      this.modules = modules
      return this.buildGraphQLSchemaFromModules(modules)
    })
    .then(graphQLSchema => {
      this.graphQLSchema = graphQLSchema
      return this.startDatabase()
    })
    .then(() => {
      return this.startServer()
    })
    .catch(e => console.log(e))
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
        filepath = ['.', this.modulesPath, moduleId, filepath].join('/')
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
    mongoose.Promise = global.Promise
    return mongoose.connect('mongodb://localhost/yineo')
  }

  startServer() {
    this.server.use('/graphql', graphqlHTTP({
      schema: this.graphQLSchema,
      rootValue: global,
      graphiql: true,
    }))
    this.server.listen(4000);
  }

  discoverModules(callback) {
    const modules = {}
    return fse.readdir(this.modulesPath).then((items)  => {
      for (var i=0; i<items.length; i++) {
        const modulePath = "./modules/" + items[i]
        const module = require(modulePath)
        module.path = modulePath
        modules[items[i]] = module
      }
      return modules
    })
  }

}

module.exports = new App()
