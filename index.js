/**
 * Boostrap app as soon as we are connected to database
 */
const mongoose = require('mongoose')
const express = require('express')
const schema = require('./schema')
const graphqlHTTP = require('express-graphql')

mongoose.Promise = global.Promise
mongoose
.connect('mongodb://localhost/yineo')
.then(() => runApp())
.catch(error => console.log(error))

function runApp() {
  const app = express()
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true,
  }))
  app.listen(4000);
}
