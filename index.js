const express = require('express')
const schema = require('./schema.js')
const graphqlHTTP = require('express-graphql')

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.connect('mongodb://localhost/test');

const postSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  tags: Array
});
var post = mongoose.model('Blog', postSchema);


const app = express()

// mount graphql url.
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))
app.listen(4000);

console.log('Running a GraphQL API server @ localhost:4000/graphql');
