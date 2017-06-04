const express = require('express')
const schema = require('./schema.js')
const graphqlHTTP = require('express-graphql')
const app = express()

// mount graphql on the homepage.
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))
app.listen(4000);

console.log('Running a GraphQL API server @ localhost:4000/graphql');
