const router = require('express').Router();
const auth = require('../middlewares/auth')

const { createClothingItem, getClothingItems, likeItem, dislikeItem, deleteClothingItem } = require('../controllers/clothingItems');

router.post('/', auth, createClothingItem);
router.get('/', getClothingItems);
router.put('/:itemId/likes', auth, likeItem);
router.delete('/:itemId/likes', auth, dislikeItem);
router.delete('/:itemId', auth, deleteClothingItem);

module.exports = router;