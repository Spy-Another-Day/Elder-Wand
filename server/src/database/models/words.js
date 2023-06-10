const mongoose = require('mongoose');
const wordsSchema = mongoose.Schema({
  topic: {type: String,
    require: true,
    index: true},
  words: {type: [String],
    require: true},

});
const Words = mongoose.model('words', wordsSchema);
module.exports = Words;