const Users = require('../models/users.js');
const conn = require('../index.js');


module.exports = {

  getUser: (req, res) => {
    const username = req.params;

    Users.findOne(username)
    .then((result) => {
      if (result === null) {
        res.status(204).send('no user found')
      } else {
        res.staus(200).send(result[0])
      }
    })
    .catch(err => console.log(err))
  },
  postUser: (req, res) => {
    const {username, nickname, email, password, salt} = req.body;
    if (username === undefined || nickname === undefined|| password ===undefined) {
      res.status(205).send('username, nickname, or password needs to be determined')
    } else {
      Users.findOne(username)
      .then((result) => {
        if (result === null) {
          res.status(205).send('user already exist')
        } else {
          Users.create(req.body)
          .then((result) => {

            res.status(201).send('user created')
          })
          .catch(err => console.log(err))

        }
      })
      .catch(err => console.log(err))
    }

  },
  patchNickname: (req, res)=>{
    const {username, nickname} = req.body;
    let filter = {username: username};
    let update = {nickname: nickname};

    Users.findOne(filter)
    .then(result => {
      if(result === null) {
        res.status(204).send('user not found')
      }else {
        Users.findOneAndUpdate(filter, update)
        .then(result => {
          res.status(200).send('nickname updated')
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))

  },
  patchPassword: (req, res)=>{
    const {username, password} = req.body;
    let filter = {username: username};
    let update = {password: nickname};

    Users.findOne(filter)
    .then(result => {
      if(result === null) {
        res.status(204).send('user not found')
      }else {
        Users.findOneAndUpdate(filter, update)
        .then(result => {
          res.status(200).send('password updated')
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  }

}