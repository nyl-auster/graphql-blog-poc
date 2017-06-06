/**
* API pour récupérer les données dans la base de données
*/
import mongoose from 'mongoose'
import postSchema from '../mongoose/postSchema'
import TagService from './tagService'

class PostService {

  constructor() {
    this.model = mongoose.model('Post', postSchema)
  }

  getAll(filters = {}) {
    return this.model.find(filters)
  }

  getOneBySlug(slug) {
    return this.model.findOne({slug: slug})
  }

  getOneById(id) {
    return this.model.findOne({_id: id})
  }

  create(values) {
    return new this.model(values).save()
  }

  update(document) {
    return this.model.update(document)
  }

}

module.exports = new PostService()
