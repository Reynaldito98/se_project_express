const router = require('express').Router();
const auth = require('../middlewares/auth');
const {validateCardBody, validateId} = require('../middlewares/validation');

const { createClothingItem, getClothingItems, likeItem, dislikeItem, deleteClothingItem } = require('../controllers/clothingItems');

router.post('/', auth, validateCardBody, createClothingItem);
router.get('/', getClothingItems);
router.put('/:itemId/likes', auth, validateId, likeItem);
router.delete('/:itemId/likes', auth, validateId, dislikeItem);
router.delete('/:itemId', auth, validateId, deleteClothingItem);

module.exports = router;