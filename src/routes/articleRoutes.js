const express = require('express');
const router = express.Router();
const {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getArticles).post(protect, createArticle);
router
    .route('/:id')
    .get(getArticleById)
    .put(protect, updateArticle)
    .delete(protect, deleteArticle);

module.exports = router;
