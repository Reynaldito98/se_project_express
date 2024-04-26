const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const error = require('../utils/errors');
const {JWT_SECRET} = require('../utils/config');

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
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

module.exports.updateProfile = (req, res) => {
  const {_id} = req.user;
  const {name, avatar} = req.body;

  User.findByIdAndUpdate(_id, {name, avatar}, {new: true, runValidators: true})
    .orFail()
    .then(user => res.send({data: user}))
    .catch((e) => {
      if(e.name === "ValidationError"){
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
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(users => res.send({name: users.name, avatar: users.avatar, email: users.email}))
    .catch((e) => {
      if(e.code===11000) {
        res.status(error.DOUBLE_EMAIL).send({message: "There is a duplicate email"})
      }
      if(e.name === "ValidationError"){
        res.status(error.BAD_REQUEST).send({message: "Invalid data"})
      } else {
        res.status(error.DEFAULT).send({message:  "An error has occurred on the server."})
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).select('+password')
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(error.UNAUTHORIZED).send({ message: err.message });
    });
};