const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const fse = require('fs-extra');
const graphql = require('graphql')
const _ = require('lodash')

const config = parseConfigFile('./config')

function getEnv() {
  const env = process.env.NODE_ENV
  return env
}

/**
 * Merge default config and current environment config in a single objetct
 * @param {string} relative path to JSON config file 
 */
function parseConfigFile(file) {
  let activeconfig = {}
  const env = getEnv()
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
function connectToMongoDB(mongoose, mongoDBUri) {
  mongoose.Promise = global.Promise
  return mongoose.connect(config.mongodb_uri).then(() => {
    console.log("connected successfully to 'mongodb://localhost/yineo' ! ")
  }).catch((e) => {
    console.log(e)
  })
}

/**
 * Collect graphQL schema definition from modules to build 
 * our graphQL schema
 * @param {array} modules
 */
function buildGraphQLSchemaFromModules(modules, modulesPath) {
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
    // les clefs de "fields" sont les points d'entrée pour notre API en http GET
    fields: queryFields
  });

  const schema = new graphql.GraphQLSchema({
    query: queryType
  })

  return schema
}

function startServer(graphQLSchema) {
    const app = express()
    app.use('/graphql', graphqlHTTP({
      schema: graphQLSchema,
      rootValue: global,
      graphiql: true,
    }))
    app.listen(config.httpServerPort)
  }

/**
 * @param {string} modulesPath
 */
async function discoverModules(modulesPath) {
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

async function start() {
    const modules = await discoverModules(config.modulesPath)
    const graphQLSchema = buildGraphQLSchemaFromModules(modules, config.modulesPath)
    await connectToMongoDB(mongoose, config.mongodb_uri)
    startServer(graphQLSchema)
}

module.exports = {
  config,
  start
}
