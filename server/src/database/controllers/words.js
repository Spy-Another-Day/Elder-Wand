const Words = require('../models/words.js');
const conn = require('../index.js');


module.exports = {
  getTopics: (req, res)=> {
    Words.find().select('topic')
    .then(result=> {
      res.(200).send(result)
    })
    .catch(err => console.log(err))
  },
  getAllTopicWords: (req, res)=> {
    Words.find()
    .then(result=> {
      res.(200).send(result)
    })
    .catch(err => console.log(err))
  },
  getWords: (req, res) => {
    const {topic} = req.params;
    const lookup = {topic: topic}
    Words.find(lookup)
    .then(result=> {

      res.(200).send(result)
    })
    .catch(err => console.log(err))
  },
  postNewTopic: (req,res)=> {
    const {topic, words} = req.body;

    if(topic === undefined || words === undefined || !Array.isArray(words)) {
      res.status(205).send('topic or words is invalid')
    } else{
      Words.create(req.body)
      .then(result => {
        res.status(201).send('topic created')
      })
    }
  },
  patchAddNewWords: (req, res) => {
    const {topic, words} =  req.body;

    if(topic === undefined || words === undefined || !Array.isArray(words)) {
      res.status(205).send('topic or words is invalid')
    } else {
      let filter = {topic: topic};
      let update = { "$push": { "words": { "$each": words }}};

      Words.findOne(filter)
      .then(result => {
        if(result === null) {
          res.status(204).send('topic not found')
        }else {
          Words.findOneAndUpdate(filter, update)
          .then(result => {
            res.status(200).send('words added')
          })
          .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))

      .findOneAndUpdate(filter, update)
    }
  }

}