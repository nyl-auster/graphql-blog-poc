/**
* API pour récupérer les données dans la base de données
*/
const mongoose = require('mongoose')
const postSchema = require('../mongoose/postSchema')
const TagService = require('./tagService')
const model = mongoose.model('Post', postSchema)

module.exports =  {

  getAll(filters = {}) {
    return model.find(filters).lean()
  },

  getOneBySlug(slug) {
    return model.findOne({slug: slug}).lean()
  },

  getOneById(id) {
    return model.findOne({_id: id}).lean()
  },

  // retourner la liste des posts selon un tag
  getAllByTagId(tagId) {
    return model.find({tagsIds: tagId}).lean()
  },

  create(values) {
    return new model(values).save()
  },

  update(document) {
    return model.update(document)
  }

}
