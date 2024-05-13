const router = require('express').Router();
const error = require('../utils/errors');
const clothingItem = require('./clothingItem');
const {login, createUser} = require('../controllers/users');
const user = require('./user');


router.use('/users', user);
router.use('/items', clothingItem);
router.post('/signin', login);
router.post('/signup', createUser);


router.use((req, res) => {
  res.status(error.NOT_FOUND).send({message: 'Document not found'})
})

module.exports = router;