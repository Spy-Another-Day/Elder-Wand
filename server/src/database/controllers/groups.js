const Groups = require('../models/groups.js');
const conn = require('../index.js');


module.exports = {

  getGroups: (req, res) => {
    Groups.find()
    .then(result=> {
      res.status(200).send(result)
    })
    .catch(err => console.log(err))
  },
  getGroup: (req, res) => {
    const groupName = req.params;
    Groups.findOne(groupName)
    .then((result) => {
      if (result === null) {
        res.status(204).send('204 no group is found')
      } else {
        res.status(200).send(result)
      }
    })
    .catch(err => console.log(err))

  },
  postGroup: (req, res) => {
    const {groupName, groupMembers} =  req.body;
    const data = {groupName: groupName, groupMembers:groupMembers}
    if(groupMembers === undefined || groupName === undefined || !Array.isArray(groupMembers)) {

      res.status(205).send('205 groupMembers or words groupName invalid')
    } else {
      Groups.findOne({groupName : groupName})
      .then((result) => {
        if (result === null) {
          Groups.create(data)
          .then(result => {
            res.status(201).send('201 group created')
          })
          .catch(err => console.log(err))
        } else {
          res.status(205).send('group already exist')
        }
        })
        .catch(err => console.log(err))


    }
  },
  putGroupMember: (req, res) => {
    const {groupName, groupMembers} = req.body;
    if(groupMembers === undefined || groupName === undefined || !Array.isArray(groupMembers)) {
      res.status(205).send('205 groupMembers or words groupName invalid')
    } else {
    let filter = {groupName: groupName};
    let update = { "$push": { "groupMembers": { "$each": groupMembers }}};
    Groups.findOne(filter)
    .then(result=> {
      if(result === null) {
        res.status(204).send('204 group not found')
      } else {
        Groups.findOneAndUpdate(filter, update)
          .then(result => {
            res.status(200).send('200 member added')
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
    }
  },
  deleteGroupMember: (req, res) => {
    const {groupName, groupMember} = req.body;

    if(groupMember === undefined || groupName === undefined ) {
      res.status(205).send('205 groupMember or words groupName invalid')
    } else {
      const filter = {groupName:groupName}
      const pull = {$pull: {groupMembers:groupMember}}
      Groups.findOneAndUpdate(filter, pull)
          .then(result => {

            res.status(200).send('200 member deleted')
          })
          .catch(err => console.log(err))
    }
  },
  patchGroupName: (req, res) => {
    const {currentGroupName, changeToGroupName} = req.body;
    let filter = {groupName: currentGroupName};
    let update = {groupName: changeToGroupName};

    Groups.findOne(update)
    .then(result => {
      if(result !== null) {
        res.status(205).send('205 new group name already exist')
      } else {
        Groups.findOneAndUpdate(filter, update)
        .then(result => {
          res.status(200).send('200 group name updated')
        })
        .catch(err => console.log(err))
      }
    })

  },
  deleteGroup: (req, res) => {
    const groupName = req.params;
    Groups.deleteOne(groupName)
    .then(result=> {

      res.status(200).send('200 group deleted')
    })
    .catch(err => console.log(err))
  }

}