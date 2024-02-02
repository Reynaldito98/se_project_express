const router = require('express').Router();
const error = require('../utils/errors');
const clothingItem = require('./clothingItem');
const user = require('./user');

router.use('/users', user);
router.use('/items', clothingItem);


router.use((req, res) => {
  res.status(error.NOT_FOUND).send({message: 'Document not found'})
})

module.exports = router;