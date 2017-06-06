module.exports = {
  name: "Blog",
  description: "provides a post and tag content type for blogging",
  plugins: {
    graphQL: [
      'graphQL/postGraphQL',
      'graphQL/tagGraphQL'
    ]
  }
}
