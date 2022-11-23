const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dataSchema = new Schema({
  originalURL: {
    type: String,
    required: true
  },
  shortURL: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Data', dataSchema)