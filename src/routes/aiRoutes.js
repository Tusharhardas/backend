const express = require('express');
const router = express.Router();
const {
    improveArticleContent,
    generateArticleSummary,
    suggestArticleTitle,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/improve', protect, improveArticleContent);
router.post('/summarize', protect, generateArticleSummary);
router.post('/suggest-title', protect, suggestArticleTitle);
router.get('/health', (req, res) => res.json({ status: 'ok', version: '2.1-debug', time: new Date().toISOString() }));

module.exports = router;
