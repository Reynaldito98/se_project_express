const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');
const ClothingItem = require('../models/clothingItem');

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then(item => {
      if(!item) {
        throw new NotFoundError('No user matching ID found');
      }

      res.status(200).send(item)
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl} = req.body;
  const userId  = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner: userId})
    .then(item => res.send(item))
    .catch((e) => {
      if(e.name === "ValidationError"){
        next(new BadRequestError('The ID string is invalid'))
      } else {
        next(e)
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId).orFail().then((item) => {
    if(String(item.owner) === req.user._id) {
        return item.deleteOne().then(() => res.send({message: 'Item deleted'}))
    }
    throw new ForbiddenError('Access denied');
  })
  .catch((e) => {
    if(e.name === "CastError"){
      next(new BadRequestError('The ID string is invalid'))
    } else if(e.name === "DocumentNotFoundError") {
      next(new NotFoundError('No item matching ID found'))
    }
    else {
      next(e);
    }
  })
}

module.exports.likeItem = (req, res, next) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail().then(item => res.send({ data: item }))
.catch((e) => {
  if(e.name === "CastError"){
    next(new BadRequestError('The ID string is invalid'))
  } else if(e.name === "DocumentNotFoundError") {
    next(new NotFoundError('No item matching ID found'))
  }
  else {
    next(e);
  }
});

module.exports.dislikeItem = (req, res, next) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail().then(item => res.send({ data: item }))
.catch((e) => {
  if(e.name === "CastError"){
    next(new BadRequestError('The ID string is invalid'))
  } else if(e.name === "DocumentNotFoundError") {
    next(new NotFoundError('No item matching ID found'))
  }
  else {
    next(e)
  }
});