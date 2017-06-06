/**
 * Generate a graphql schema
 */
const graphql = require('graphql')
const _ = require('lodash')

const schemasPaths = [
  './modules/blog/graphQL/postGraphQL',
  './modules/blog/graphQL/tagGraphQL'
]

function collectSchemaQueryFields(schemas) {

  let queryFields = {}
  for (const filepath of schemas) {
    console.log(filepath)
    let schemaFragment = require(filepath)
    for (const property in schemaFragment.queryFields) {
      queryFields[property] = schemaFragment.queryFields[property]
    }
  }

  // Entry points : les "resolvers"
  const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    // les clefs de "fields" sont les points d'entrée pour notre API en http GET
    fields: collectSchemaQueryFields(schemasPaths)
  });

  const schema = new graphql.GraphQLSchema({
    query: queryType
  })


  return schema
}

// Entry points : les "resolvers"
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  // les clefs de "fields" sont les points d'entrée pour notre API en http GET
  fields: collectSchemaQueryFields(schemasPaths)
});

module.exports = new graphql.GraphQLSchema({
  query: queryType
})
