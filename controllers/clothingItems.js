const ClothingItem = require('../models/clothingItem');
const error = require('../utils/errors');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then(item => res.status(200).send(item))
    .catch(() => {
      res.status(error.DEFAULT).send({message:  "An error has occurred on the server."});
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl} = req.body;
  const userId  = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner: userId})
    .then(item => res.send(item))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(error.BAD_REQUEST).send({message: "Invalid data"})
      } else {
        res.status(error.DEFAULT).send({message:  "An error has occurred on the server."})
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId).orFail().then((item) => {
    if(String(item.owner) === req.user._id) {
        return item.deleteOne().then(() => res.send({message: 'Item deleted'}))
    }
    return res.status(error.FORBIDDEN).send({message: "You are not allowed to delete this item"})
  })
  .catch((e) => {
    if(e.name === "CastError"){
      res.status(error.BAD_REQUEST).send({message: "Invalid data"})
    } else if(e.name === "DocumentNotFoundError") {
      res.status(error.NOT_FOUND).send({message: "Document not found"})
    }
    else {
      res.status(error.DEFAULT).send({message:  "An error has occurred on the server."})
    }
  })
}

module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail().then(item => res.send({ data: item }))
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

module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail().then(item => res.send({ data: item }))
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