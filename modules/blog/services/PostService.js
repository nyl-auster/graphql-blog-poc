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

  getOne(id) {
    return this.postModel.findOne({_id: id})
  }

  create(values) {
    return new this.postModel(values).save()
  }

  update(document) {
    return this.postModel.update(document)
  }

}

module.exports = new PostService()
