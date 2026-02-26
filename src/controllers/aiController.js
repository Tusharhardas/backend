const asyncHandler = require('express-async-handler');
const { improveContent, generateSummary, suggestTitle } = require('../services/aiService');

// @desc    Improve article content
// @route   POST /api/ai/improve
// @access  Private
const improveArticleContent = asyncHandler(async (req, res) => {
    const { content, action } = req.body;
    const improved = await improveContent(content, action);
    res.json({ improved });
});

// @desc    Generate article summary
// @route   POST /api/ai/summarize
// @access  Private
const generateArticleSummary = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const summary = await generateSummary(content);
    res.json({ summary });
});

// @desc    Suggest article title
// @route   POST /api/ai/suggest-title
// @access  Private
const suggestArticleTitle = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const improvedTitle = await suggestTitle(content);
    res.json({ improvedTitle });
});

module.exports = {
    improveArticleContent,
    generateArticleSummary,
    suggestArticleTitle,
};
