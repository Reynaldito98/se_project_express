const router = require('express').Router();

const { createClothingItem, getClothingItems, likeItem, dislikeItem, deleteClothingItem } = require('../controllers/clothingItems');

router.post('/', createClothingItem);
router.get('/', getClothingItems);
router.put('/:itemId', updateClothingItems);
router.put('/:itemId/likes', likeItem);
router.put('/:itemId/likes', dislikeItem);
router.delete('/:itemId', deleteClothingItem);

module.exports = router;