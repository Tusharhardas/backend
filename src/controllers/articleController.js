const asyncHandler = require('express-async-handler');
const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Create new article
// @route   POST /api/articles
// @access  Private
const createArticle = asyncHandler(async (req, res) => {
    const { title, category, content, tags, summary } = req.body;

    const article = await Article.create({
        title,
        category,
        content,
        tags,
        summary,
        authorId: req.user.id,
    });

    res.status(201).json(article);
});

// @desc    Get all public articles
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
    const articles = await Article.findAll({
        include: [{ model: User, attributes: ['id', 'username'] }],
        order: [['createdAt', 'DESC']],
    });
    res.json(articles);
});

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id, {
        include: [{ model: User, attributes: ['id', 'username'] }],
    });

    if (article) {
        article.views += 1;
        await article.save();
        res.json(article);
    } else {
        res.status(404);
        throw new Error('Article not found');
    }
});

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = asyncHandler(async (req, res) => {
    const { title, category, content, tags, summary } = req.body;

    const article = await Article.findByPk(req.params.id);

    if (article) {
        if (article.authorId !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized to update this article');
        }

        article.title = title || article.title;
        article.category = category || article.category;
        article.content = content || article.content;
        article.tags = tags || article.tags;
        article.summary = summary || article.summary;

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } else {
        res.status(404);
        throw new Error('Article not found');
    }
});

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id);

    if (article) {
        if (article.authorId !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized to delete this article');
        }

        await article.destroy();
        res.json({ message: 'Article removed' });
    } else {
        res.status(404);
        throw new Error('Article not found');
    }
});

module.exports = {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
};
