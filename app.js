const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const fse = require('fs-extra');
const graphql = require('graphql')
const _ = require('lodash')

class App {

  constructor() {
    this.config = this.parseConfigFile('./config')
  }

  parseConfigFile(file) {
    let activeconfig = {}
    const env = this.getEnv()
    const config = require("./" + file)
    activeconfig = config['*']
    for (const property in config[env]) {
      activeconfig[property] = config[env][property]
    }
    return activeconfig
  }

  /**
   * 
   * @param {object} mongoose 
   * @param {string} mongoDBUri 
   */
  connectToMongoDB(mongoose, mongoDBUri) {
    mongoose.Promise = global.Promise
    return mongoose.connect(mongoDBUri).then(() => {
      console.log("connected successfully to 'mongodb://localhost/yineo' ! ")
    }).catch((e) => {
      console.log(e)
    })
  }

  getEnv() {
    return process.env.NODE_ENV
  }

  /**
   * Collect graphQL schema definition from modules to build 
   * our graphQL schema
   * @param {array} modules
   */
  buildGraphQLSchemaFromModules(modules, modulesPath) {
    // collect query fields from modules
    let queryFields = {}
    for (const moduleId in modules) {
      for (let filepath of modules[moduleId].plugins.graphQL) {
        filepath = ['.', modulesPath, moduleId, filepath].join('/')
        let schemaFragment = require(filepath)
        for (const property in schemaFragment.queryFields) {
          queryFields[property] = schemaFragment.queryFields[property]
        }
      }
    }

    // Entry points : les "resolvers"
    const queryType = new graphql.GraphQLObjectType({
      name: 'Query',
      // les clefs de "fields" contiennent les points d'entrée pour notre API en http GET
      fields: queryFields
    });

    const schema = new graphql.GraphQLSchema({
      query: queryType
    })

    return schema
  }

  /**
   * @param {string} modulesPath
   */
  async discoverModules(modulesPath) {
    const modules = {}
    const items = await fse.readdir(modulesPath)
    for (var i = 0; i < items.length; i++) {
      const modulePath = modulesPath + "/" + items[i]
      const module = require("./" + modulePath)
      module.path = modulePath
      modules[items[i]] = module
    }
    return modules
  }

  /**
   * Run our app
   */
  async start() {
    this.modules = await this.discoverModules(this.config.modulesPath)
    this.graphQLSchema = this.buildGraphQLSchemaFromModules(this.modules, this.config.modulesPath)
    await this.connectToMongoDB(mongoose, this.config.mongodb_uri)
    this.express = this.startExpress(this.graphQLSchema)
    return this
  }

}

module.exports = App
