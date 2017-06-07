const mongoose = require('mongoose')
const postSchema = require ('../mongoose/tagSchema')

class TagService {

  constructor() {
    this.model = mongoose.model('Tag', postSchema)
  }

  getAll(filters = {}) {
    return this.model.find(filters).lean()
  }

  getOneBySlug(slug) {
    return this.model.findOne({slug: slug}).lean()
  }

  getOneById(id) {
    return this.model.findOne({_id: id}).lean()
  }

  create(values) {
    return new this.model(values).save()
  }

  update(document) {
    return this.model.update(document)
  }

}

module.exports = new TagService()
