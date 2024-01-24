const router = require('express').Router();
const clothingItem = require('./clothingItem');
const user = require('./user');

router.use('/users', user);
router.use('/items', clothingItem);


router.use((req, res) => {
  res.status(500).send({message: 'Requested resource not found'})
})

module.exports = router;