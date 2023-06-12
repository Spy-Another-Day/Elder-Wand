const Words = require('../models/words.js');
const conn = require('../index.js');
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


module.exports = {
  getTopics: (req, res)=> {
    Words.find().select('topic')
    .then(result=> {
      res.status(200).send(result)
    })
    .catch(err => console.log(err))
  },
  getAllTopicWords: (req, res)=> {
    Words.find()
    .then(result=> {
      res.status(200).send(result)
    })
    .catch(err => console.log(err))
  },
  getWords: (req, res) => {
    const {topic} = req.params;
    const lookup = {topic: topic}
    Words.find(lookup)
    .then(result=> {

      res.status(200).send(result[0])
    })
    .catch(err => console.log(err))
  },
  getInitGame: (req, res) => {
    const topic = req.params.topic;
    const numberOfCards = req.query.cards || 25;
    const numberOfAssassins = req.query.assassins || 1;
    const numberOfAgents = req.query.agents || 8;

    if((numberOfAgents * 2) + 1 + numberOfAssassins > numberOfCards) {
      res.status(205).send('invalid settings');
    } else{
      const lookup = {topic: topic}
      var data = {};

      data.topic = topic;
      data.team_1_guessed = 0;
      data.team_2_guessed = 0;
      data.team_1_guess_goal = numberOfAgents;
      data.team_2_guess_goal = numberOfAgents;
      data.team_1_members = [];
      data.team_2_members = [];
      data.team_1_spymaster = '';
      data.team_2_spymaster = '';

      var deck = []
      var team_1 = 'team_1';
      var team_2 = 'team_2';

      const numberOfBystanders = numberOfCards - (numberOfAssassins + (numberOfAgents * 2) + 1);

      Words.find(lookup)
      .then(result=> {

        var words = result[0].words;
        var randomIndex = Math.floor(Math.random() * words.length);

        var temp = {};

        for(var i = 0; i < numberOfBystanders; i++) {
          //innocent bystander
          randomIndex = Math.floor(Math.random() * words.length);

          temp = {};

          temp.word = words[randomIndex];
          temp.belongsTo = 'bystander';
          temp.isTouched = false;
          deck.push(temp);

          words.splice(randomIndex, 1);
        }

        for(var i = 0; i < numberOfAgents; i++) {
          //team 1
          randomIndex = Math.floor(Math.random() * words.length);

          temp = {};

          temp.word = words[randomIndex];
          temp.belongsTo = team_1;
          temp.isTouched = false;
          deck.push(temp);

          words.splice(randomIndex, 1);

          //team 2
          randomIndex = Math.floor(Math.random() * words.length);

          temp = {};

          temp.word = words[randomIndex];
          temp.belongsTo = team_2;
          temp.isTouched = false;
          deck.push(temp);

          words.splice(randomIndex, 1);

        }

        //assassin
        for(var i = 0; i< numberOfAssassins; i++) {
          randomIndex = Math.floor(Math.random() * words.length);

          temp = {};

          temp.word = words[randomIndex];
          temp.belongsTo = 'assassin';
          temp.isTouched = false;
          deck.push(temp);
          words.splice(randomIndex, 1);
        }
        //start up team
        randomIndex = Math.floor(Math.random() * words.length);
        temp = {};
        temp.word = words[randomIndex];
        temp.isTouched = false;

        if (Math.random() >.50) {
          temp.belongsTo = team_1;
          data.startUpTeam = team_1;
          data.currentTeam = team_1;

          data.team_1_guess_goal++;

        } else{
          temp.belongsTo = team_2;
          data.startUpTeam = team_2;
          data.currentTeam = team_2;

          data.team_2_guess_goal++;

        }
        deck.push(temp);

        deck = shuffle(deck)
        var deckIndex = 0;

        var rows = Math.floor(Math.sqrt(deck.length))
        var cols = Math.floor(deck.length / rows )
        var a = [];
        for(var i = 0; i < rows; i++) {
          a[i] = [];
          for(var x = 0; x < cols; x++) {
            a[i][x] = deck[deckIndex]
            deckIndex++;
          }
        }

        var tempArray = [];

        for(var i = deckIndex; i < deck.length; i++) {

          tempArray.push(deck[deckIndex]);
          deckIndex++
        }


        if(tempArray.length !== 0) {
          a.push(tempArray);
        }
        data.words = a;
        res.status(200).send(data)
      })
      .catch(err => console.log(err))
    }

  },
  postNewTopic: (req,res)=> {
    const {topic, words} = req.body;
    const data = {topic: topic, words:words}
    if(topic === undefined || words === undefined || !Array.isArray(words)) {
      res.status(205).send('205 topic or words is invalid')
    } else{
      Words.create(data)
      .then(result => {
        res.status(201).send('201 topic created')
      })
      .catch(err => console.log(err))
    }
  },
  putAddNewWords: (req, res) => {
    const {topic, words} =  req.body;

    if(topic === undefined || words === undefined || !Array.isArray(words)) {
      res.status(205).send('205 topic or words is invalid')
    } else {
      let filter = {topic: topic};
      let update = { "$push": { "words": { "$each": words }}};

      Words.findOne(filter)
      .then(result => {
        if(result === null) {
          res.status(204).send('204 topic not found')
        }else {
          Words.findOneAndUpdate(filter, update)
          .then(result => {
            res.status(200).send('200 words added')
          })
          .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))


    }
  }

}