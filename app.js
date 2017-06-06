const express = require('express')
const schema = require('./schema')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')

class App {

  constructor() {
    this.server = express()
  }

  start() {
    this.startDatabase()
    .then(() => this.startServer())
    .catch((e) => console.log(e))
  }

  startDatabase() {
    mongoose.Promise = global.Promise
    return mongoose.connect('mongodb://localhost/yineo')
  }

  startServer() {
    this.server.use('/graphql', graphqlHTTP({
      schema: schema,
      rootValue: global,
      graphiql: true,
    }))
    this.server.listen(4000);
  }

  discoverModules() {

  }

}

module.exports = new App()
