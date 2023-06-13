const Users = require('../models/users.js');
const conn = require('../index.js');


module.exports = {

  getUser: (req, res) => {
    const username = req.params;

    Users.findOne(username)
    .then((result) => {
      if (result === null) {
        res.status(204).send('204 no user found')
      } else {
        res.status(200).send(result)
      }
    })
    .catch(err => console.log(err))
  },
  postUser: (req, res) => {
    const {username, nickname, email, password, salt} = req.body;
    const data = {
      username:username,
      nickname: nickname,
      email: email,
      password: password,
      salt:salt
    }
    if (username === undefined || nickname === undefined|| password ===undefined) {

      res.status(205).send('205 username, nickname, or password needs to be determined')
    } else {

      Users.findOne({username:username})
      .then((result) => {
        if (result !== null) {

          res.status(205).send('205 user already exist')
        } else {
          Users.create(data)
          .then((result) => {

            res.status(201).send('201 user created')
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
        res.status(204).send('204 user not found')
      }else {
        Users.findOneAndUpdate(filter, update)
        .then(result => {
          res.status(200).send('200 nickname updated')
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))

  },
  patchPassword: (req, res)=>{
    const {username, password} = req.body;
    let filter = {username: username};
    let update = {password: password};

    Users.findOne(filter)
    .then(result => {
      if(result === null) {
        res.status(204).send('user not found')
      }else {
        Users.findOneAndUpdate(filter, update)
        .then(result => {
          res.status(200).send('200 password updated')
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  }

}