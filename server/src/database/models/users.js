const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
  username: {type: String,
    require: true,
    unique: true,
    index: true},
  nickname: {type: String,
    require: true},
  email: {type: String
    },
  password: {type: String,
    require: true},
  salt: {type: String
    }

});
const Users = mongoose.model('users', usersSchema);
module.exports = Users;