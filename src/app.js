import express from 'express'
import schema from './schema'
import graphqlHTTP from 'express-graphql'
import mongoose from 'mongoose'

const fse = require('fs-extra');

class App {

  constructor() {
    this.modulesPath = "src/modules"
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
    .then((graphQLSchema) => {
      this.graphQLSchema = graphQLSchema
      return this.startDatabase()
    })
    .then(() => {
      return this.startServer()
    })
    .catch((e) => console.log(e))
  }

  buildGraphQLSchemaFromModules(modules) {
    return require('./schema.js')
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
