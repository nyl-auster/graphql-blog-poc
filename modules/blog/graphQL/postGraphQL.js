const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')
const PostService = require('../services/PostService')
const TagService = require('../services/TagService')
const tagGraphQL = require('./tagGraphQL')

/**
 * Expose graphQL types
 */
module.exports.types = {
  postType : new GraphQLObjectType({
    name: 'Post',
    fields: {
      id: { type: GraphQLString },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      tags: { type: new GraphQLList(tagGraphQL.types.tagType) },
      slug: { type: GraphQLString }
    }
  })
}

/**
 * Expose new graphQL queryFields
 */
module.exports.queryFields = {
  post: {
    type: module.exports.types.postType,
    description: "Return a single post by its slug",
    args: {
      slug: { type: GraphQLString }
    },
    resolve: function (obj, {slug}) {
      return PostService.getOneById(slug)
    }
  },
  posts: {
    type: new GraphQLList(module.exports.types.postType),
    description: "Return a list of posts",
    resolve: async function(obj) {
      const posts = await PostService.getAll()
      for (post of posts) {
        post.tags = []
        for (tagId of post.tagsIds) {
          post.tags.push(await TagService.getOneById(tagId))
        }
      }
      return posts
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
