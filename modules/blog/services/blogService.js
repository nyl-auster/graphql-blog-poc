/**
 * API pour récupérer les données dans la base de données
 */
const store = require('../../../database')
const _ = require('lodash')

class blogService {

  constructor(store) {
    this.store = store
  }

  getAllTags() {
    return this.store.tags
  }

  getPostById(id) {
    return _.find(this.store.posts,{ id: id })
  }

  getAllPosts() {
    return this.store.posts
  }

  getPostsByTagId(tagId) {
    const posts = this.getAllPosts()
    for (const postIndex in posts) {
      let hasTag = posts[postIndex].tagsIds.includes(tagId)
      if (hasTag) {
        posts.push(posts[postIndex])
      }
    }
    return posts
  }

  getTagById(id) {
    return _.find(this.store.tags, { id : id })
  }

  getTagsByIds(ids) {
    return  ids.map((id) => this.getTagById(id)).slice()
  }

}

module.exports = new blogService(store)
