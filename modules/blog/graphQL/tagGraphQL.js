const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')
const TagService = require('../services/TagService')

// expose new type
exports.types = {
  tagType : new GraphQLObjectType({
    name: 'Tag',
    fields: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      slug: { type: GraphQLString }
    }
  })
}

// expose new query fields
exports.queryFields = {
  tag: {
    type: exports.types.tagType,
    description: "Return a single tag by its slug",
    args: {
      slug: { type: GraphQLString }
    },
    resolve: function(obj, {slug}) {
      return TagService.getOneBySlug(slug)
    }
  },
  tags: {
    type: new GraphQLList(exports.types.tagType),
    description: "Return a list of tags",
    resolve: function(obj) {
      return TagService.getAll()
    }
  }
}
