const {Schema, model} = require('mongoose');

const schema = new Schema ({
  telegramId: {type: String, required: true, unique: true},
  counter: {type: Number, default: 0}
})

module.exports = model('Users', schema);