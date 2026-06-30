const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  removeCategory
} = require("../controllers/categoryController.js");

router.get('/:mission_id/categories', getAllCategories);
router.get('/:mission_id/categories/:id', getCategoryById);
router.post('/:mission_id/categories', createCategory);
router.put('/:mission_id/categories/:id', updateCategory);
router.delete('/:mission_id/categories/:id', removeCategory);

module.exports = router;
