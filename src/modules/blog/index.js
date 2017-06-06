module.exports = {
  name: "Blog",
  description: "provides a post and tag content type for blogging",
  plugins: {
    GraphQL: [
      'graphQL/postGraphQL',
      'graphQL/tagGraphQL'
    ],
    mongoose: [
      'mongoose/postSchema',
      'mongoose/tagSchema'
    ]
  }
}
