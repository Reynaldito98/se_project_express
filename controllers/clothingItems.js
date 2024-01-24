const ClothingItem = require('../models/clothingItem');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate('user')
    .then(items => res.status(200).send({ data: items }))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(400).send({message: e.message})
      } else {
        res.status(500).send({message: e.message})
      }
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl} = req.body;
  const userId  = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner: userId})
    .then(item => res.send({ data: item }))
    .catch((e) => {
      if(e.name === "ValidationError"){
        res.status(400).send({message: e.message})
      } else {
        res.status(500).send({message: e.message})
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => res.status(204).send({data: item}))
  .catch((e) => {
    if(e.name === "ValidationError"){
      res.status(400).send({message: e.message})
    } else {
      res.status(500).send({message: e.message})
    }
  })
}

module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then(item => res.send({ data: item }))
.catch((e) => {
  if(e.name === "ValidationError"){
    res.status(400).send({message: e.message})
  } else {
    res.status(500).send({message: e.message})
  }
});

module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then(item => res.send({ data: item }))
.catch((e) => {
  if(e.name === "ValidationError"){
    res.status(400).send({message: e.message})
  } else {
    res.status(500).send({message: e.message})
  }
});