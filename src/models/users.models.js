const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

/* mongoose.connect(process.env.MONGODB_URL).then(console.log('Connected to user database!')); */

const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String,
  admin: Boolean,
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);