const graphql = require('graphql')
const TagService = require('../services/TagService')

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
    description: "Return a single tag by its slug",
    args: {
      slug: { type: graphql.GraphQLString }
    },
    resolve: function(obj, {slug}) {
      return TagService.getOneBySlug(slug)
    }
  },
  tags: {
    type: new graphql.GraphQLList(exports.types.tagType),
    description: "Return a list of tags",
    resolve: function(obj) {
      return TagService.getAll()
    }
  }
}
