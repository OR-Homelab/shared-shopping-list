const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL).then(console.log('Connected to item database!'));

const Schema = mongoose.Schema;

const Item = new Schema({
  name: String,
  amount: Number,
  price: Number,
  total: Number,
  active: Boolean,
  age: Date
});

module.exports = mongoose.model('Item', Item);