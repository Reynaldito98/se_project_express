const router = require('express').Router();

const { createClothingItem, getClothingItems, likeItem, dislikeItem, deleteClothingItem } = require('../controllers/clothingItems');

router.post('/', createClothingItem);
router.get('/', getClothingItems);
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);
router.delete('/:itemId', deleteClothingItem);

module.exports = router;