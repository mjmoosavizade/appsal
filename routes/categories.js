const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categories");
const checkAuth = require('../middleware/chcek-auth');


router.get(`/`, checkAuth, categoryController.getAllCategories);

router.get(`/:id`, checkAuth, categoryController.getOneCategory);

router.post(`/`, checkAuth, categoryController.createCategory);

router.delete('/:id', checkAuth, categoryController.deleteCategory);

router.put('/:id', checkAuth, categoryController.updateCategory);

module.exports = router;