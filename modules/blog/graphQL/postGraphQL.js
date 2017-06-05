const graphql = require('graphql')
const PostService = require('../services/PostService')
const tagGraphQL = require('./tagGraphQL')

/**
 * Expose graphQL types
 */
module.exports.types = {
  postType : new graphql.GraphQLObjectType({
    name: 'Post',
    fields: {
      id: { type: graphql.GraphQLString },
      title: { type: graphql.GraphQLString },
      content: { type: graphql.GraphQLString },
      tags: { type: new graphql.GraphQLList(tagGraphQL.types.tagType) },
      slug: { type: graphql.GraphQLString }
    }
  })
}

/**
 * Expose new graphQL queryFields
 */
module.exports.queryFields = {
  post: {
    type: exports.types.postType,
    description: "Return a single post by its slug",
    args: {
      slug: { type: graphql.GraphQLString }
    },
    resolve: function (obj, {slug}) {
      return PostService.getOneById(slug)
    }
  },
  posts: {
    type: new graphql.GraphQLList(exports.types.postType),
    description: "Return a list of posts",
    resolve: function(obj) {
      return PostService.getAll()
    }
  }
  /*
  postsByTagId: {
    type: new graphql.GraphQLList(exports.types.postType),
    args: {
      tagId: { type: graphql.GraphQLString }
    },
    description: "Return a list of post for a specific tag",
    resolve: function(obj, {tagId}) {
      return blogService.getPostsByTagId().map(post => {
        post.tags = blogService.getTagsByIds(post.tagsIds)
        return post
      })
    }
  }
  */
}