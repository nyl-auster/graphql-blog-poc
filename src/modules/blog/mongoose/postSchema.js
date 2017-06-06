import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  content: { type: String },
  status: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  published: { type: Date, default: null },
  tagsIds: { type: Array }
})
