/**
* API pour récupérer les données dans la base de données
*/
const mongoose = require('mongoose')
const postSchema = require('../mongoose/postSchema')

class PostService {

  constructor() {
    this.postModel = mongoose.model('Post', postSchema)
  }

  getAll(filters = {}) {
    return this.postModel.find(filters)
  }

  getOne(filters) {
    return this.postModel.findOne(filters)
  }

  create(values) {
    return new this.postModel(values).save()
  }

}

module.exports = new PostService()
