const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {JWT_SECRET} = require('../utils/config');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error')

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then(user => res.send({data: user}))
    .catch((e) => {
      if(e.name === "CastError"){
        next(new BadRequestError('The ID string is invalid'));
      } else if(e.name === "DocumentNotFoundError") {
        next(new NotFoundError('No user matching ID found'));
      }
      else {
        next(e);
      }
    });
}

module.exports.updateProfile = (req, res, next) => {
  const {_id} = req.user;
  const {name, avatar} = req.body;

  User.findByIdAndUpdate(_id, {name, avatar}, {new: true, runValidators: true})
    .orFail()
    .then(user => {
        if(!user) {
          throw new NotFoundError('No user matching ID found');
        }

        res.send({data: user})
      })
    .catch((e) => {
      if(e.name === "ValidationError"){
        next(new BadRequestError('The ID string is invalid'));
      } else if(e.name === "DocumentNotFoundError") {
        next(new NotFoundError('No user matching ID found'));
      }
      else {
        next(e);
      }
    });
}

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(users => res.send({name: users.name, avatar: users.avatar, email: users.email}))
    .catch((e) => {
      if(e.code===11000) {
        next(new ConflictError('There is a duplicate email'));
      }
      if(e.name === "ValidationError"){
        next(new BadRequestError('The ID string is invalid'));
      } else {
        next(e);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
        email,
        name: user.name,
        avatar: user.avatar,
        _id: user._id
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError('Access denied'))
     } else {
        next(err);
      }
    });
};