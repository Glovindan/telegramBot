const {Schema, model} = require('mongoose');

const schema = new Schema ({
  questionText: {type: String, required: true},
  //URL картинки
  answerText: {type: String, required: true},
  questionId: {type: String, required: true}
})

module.exports = model('Questions', schema);