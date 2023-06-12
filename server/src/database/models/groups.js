const mongoose = require('mongoose');
const groupSchema = mongoose.Schema({
  groupName: {type: String,
    require: true,
    index: true,
  unique:true},
  groupMembers: {type: [String],
    require: true},

});
const Groups = mongoose.model('groups', groupSchema);
module.exports = Groups;