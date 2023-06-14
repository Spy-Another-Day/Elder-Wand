const History = require('../models/history.js');
const conn = require('../index.js');

module.exports = {

  getHistory: (req, res) => {
    var limit = req.query.limit || 30;
    History.find().sort({_id: -1}).limit(limit)
    .then(result => {
      res.status(200).send(result)
    })
    .catch(err => console.log(err))

  },
  postHistory: (req, res) => {
    const {team_1_guessed, team_2_guessed, team_1_members, team_2_members, team_1_spymaster, team_2_spymaster, words, roomID, startUpTeam, teamWon, topic, team_1, team_2, team_1_score, team_2_score, winReason} = req.body;
    var team1members = [];
    var team2members = [];

    for(var i in team_1_members) {
      team1members.push(`${team_1_members[i]} (${i})`)
    }
    for(var i in team_2_members) {
      team1members.push(`${team_2_members[i]} (${i})`)
    }
    var data = {team_1: team_1,
                team_2:team_2,
                team_1_guessed: team_1_guessed,
                team_2_guessed: team_2_guessed,
                team_1_members: team1members,
                team_2_members: team2members,
                team_1_spymaster: team_1_spymaster,
                team_2_spymaster: team_2_spymaster,
                words: words,
                topic: topic,
                startUpTeam: startUpTeam,
                teamWon: teamWon,
                roomID:roomID,
                team_1_score: team_1_score,
                team_2_score: team_2_score,
                winReason: winReason
              }

    History.create(data)
    .then(result => {
      res.status(201).send('201 history created')
    })
    .catch(err => console.log(err))

  }
}