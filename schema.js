const graphql = require('graphql')
const _ = require('lodash')
const blogService = require('./blogService')

/*=================================
DECLARATION DES TYPES GRAPHQL
==================================*/

var tagType = new graphql.GraphQLObjectType({
  name: 'Tag',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    slug: { type: graphql.GraphQLString }
  }
});

// Définir ntore modèle de Post
var postType = new graphql.GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: graphql.GraphQLString },
    title: { type: graphql.GraphQLString },
    content: { type: graphql.GraphQLString },
    tags: {type: new graphql.GraphQLList(tagType)}
  }
});

/*=========================
GRAPHQL SCHEMA
=========================*/

// Entry points : les "resolvers"
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  // les clefs de "fields" sont les points d'entrée pour notre API en http GET
  fields: {
    post: {
      type: postType,
      description: "Return a single blog post by its ids",
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function (obj, {id}) {
        return blogService.getPostById(id)
      }
    },
    posts: {
      type: new graphql.GraphQLList(postType),
      description: "Return a list of posts",
      resolve: function(obj) {
        return blogService.getAllPosts().map(post => {
          post.tags = blogService.getTagsByIds(post.tagsIds)
          return post
        })
      }
    },
    postsByTagId: {
      type: new graphql.GraphQLList(postType),
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
    },
    tag: {
      type: tagType,
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function(obj, {id}) {
        return blogService.getTagById(id)
      }
    },
    tags: {
      type: new graphql.GraphQLList(tagType),
      description: "Return a list of tags",
      resolve: function(obj) {
        return blogService.getAllTags()
      }
    },
  }
});

module.exports = new graphql.GraphQLSchema({
  query: queryType
})
