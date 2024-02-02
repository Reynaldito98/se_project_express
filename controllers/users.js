const User = require('../models/user');
const error = require('../utils/errors')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => {
      res.status(error.DEFAULT).send({message:  "An error has occurred on the server."})
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then(user => res.send({data: user}))
    .catch((e) => {
      if(e.name === "CastError"){
        res.status(error.BAD_REQUEST).send({message: "Invalid data"})
      } else if(e.name === "DocumentNotFoundError") {
        res.status(error.NOT_FOUND).send({message: "Document not found"})
      }
      else {
        res.status(error.DEFAULT).send({message:  "An error has occurred on the server."})
      }
    });
}

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then(users => res.send({ data: users }))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(error.BAD_REQUEST).send({message: "Invalid data"})
      } else {
        res.status(error.DEFAULT).send({message:  "An error has occurred on the server."})
      }
    });
};