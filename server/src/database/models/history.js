const mongoose = require('mongoose');
const historySchema = mongoose.Schema({
  topic: {type: String,
    require: true},

  roomID: {type: String,
    require: true,
    index: true},
  team_1:{type:String,
    require:true},
    team_2:{type:String,
      require:true},
  team_1_spymaster:{type: String,
    require: true},

  team_2_spymaster:{type: String,
    require: true},

  team_1_members: {type: {},
   require:true},

  team_2_members: {type: {},
   require:true},

  words: {type:[],
    require:true},

  team_1_guessed: {type: Number,
    require: true},

  team_2_guessed: {type: Number,
    require: true},

    team_1_score: {type: Number},

    team_2_score: {type: Number},

    winReason: {type: String},

  startUpTeam: {type:String,
    require:true},

  teamWon: {type:String},


}, { timestamps: true });
const History = mongoose.model('history', historySchema);
module.exports = History;