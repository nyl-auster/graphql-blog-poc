const graphql = require('graphql')
const blogService = require('../services/blogService')

// expose new type
module.exports.types = {
  tagType : new graphql.GraphQLObjectType({
    name: 'Tag',
    fields: {
      id: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
      slug: { type: graphql.GraphQLString }
    }
  })
}

// expose new query fields
module.exports.queryFields = {
  tag: {
    type: exports.types.tagType,
    args: {
      id: { type: graphql.GraphQLString }
    },
    resolve: function(obj, {id}) {
      return blogService.getTagById(id)
    }
  },
  tags: {
    type: new graphql.GraphQLList(exports.types.tagType),
    description: "Return a list of tags",
    resolve: function(obj) {
      return blogService.getAllTags()
    }
  }
}
