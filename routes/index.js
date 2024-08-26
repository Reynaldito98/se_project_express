const router = require('express').Router();
const clothingItem = require('./clothingItem');
const {login, createUser} = require('../controllers/users');
const user = require('./user');
const { authentication, validateUserBody } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');


router.use('/users', user);
router.use('/items', clothingItem);
router.post('/signin', authentication, login);
router.post('/signup', validateUserBody, createUser);


router.use(() => {
  throw new NotFoundError('Route not found');
})

module.exports = router;