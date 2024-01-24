const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(400).send({message: e.message})
      } else {
        res.status(500).send({message: e.message})
      }
    });
};

module.exports.getUser = (req, res) => {
  const { _id } = req.body;

  User.findById(_id)
    .orFail()
    .then(user => res.send({data: user}))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(400).send({message: e.message})
      } else {
        res.status(500).send({message: e.message})
      }
    });
}

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then(users => res.send({ data: users }))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(400).send({message: e.message})
      } else {
        res.status(500).send({message: e.message})
      }
    });
};