const mongoose = require('mongoose')
const postSchema = require ('../mongoose/tagSchema')
const model = mongoose.model('Tag', postSchema)

module.exports = {

  getAll(filters = {}) {
    return model.find(filters).lean()
  },

  getOneBySlug(slug) {
    return model.findOne({slug: slug}).lean()
  },

  getOneById(id) {
    return model.findOne({_id: id}).lean()
  },

  create(values) {
    return new model(values).save()
  },

  update(document) {
    return model.update(document)
  }

}
