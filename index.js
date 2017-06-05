// toutes nos données dépendent de la base, donc on ne lance
// le code de toute notre application qu'une fois connectés à mongoDB
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/yineo').then(() => {
  bootstrapApp()
})

function bootstrapApp() {

  const express = require('express')
  const schema = require('./schema')
  const graphqlHTTP = require('express-graphql')
  const testmongoose = require('./schemaMongoDB')
  const app = express()

  // mount graphql url.
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }))
  app.listen(4000);

}
