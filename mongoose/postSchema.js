var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  title:  String,
  slug: String,
  content:   String,
  created: { type: Date, default: Date.now },
  published: { type: Date, default: null },
  tagsIds: Array
})
