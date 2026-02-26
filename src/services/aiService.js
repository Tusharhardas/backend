const axios = require('axios');

// aiService.js - Handles the logic for AI-assisted technical writing
// Uses Pollinations.AI (free, no-key required) for text generation

const POLLINATIONS_URL = 'https://text.pollinations.ai/';

/**
 * Generic helper to call Pollinations AI
 * Tries multiple models as fallback if the first one fails
 */
const callPollinations = async (systemPrompt, userContent) => {
    // Models to cycle through for better reliability
    const models = ['openai', 'mistral', 'llama', 'searchgpt'];

    // Clean and trim content to prevent overwhelming the free API
    const cleanContent = userContent.replace(/<[^>]*>?/gm, '').substring(0, 2000);

    for (const model of models) {
        try {
            console.log(`AI Request [${model}]: ${systemPrompt.substring(0, 40)}...`);

            // Primary method: POST with JSON body
            const response = await axios.post(POLLINATIONS_URL, {
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: cleanContent }
                ],
                model: model,
                jsonMode: false
            }, {
                timeout: 25000, // Increased timeout for better resilience
                headers: { 'Content-Type': 'application/json' }
            });

            let result = '';
            if (response.data && typeof response.data === 'string') {
                result = response.data;
            } else if (response.data && response.data.choices && response.data.choices[0]) {
                result = response.data.choices[0].message.content;
            } else if (typeof response.data === 'object') {
                result = response.data.content || JSON.stringify(response.data);
            }

            if (result && result.trim().length > 5) {
                console.log(`AI Success [${model}]`);
                return result.trim();
            }
        } catch (error) {
            console.warn(`AI Attempt [${model}] failed: ${error.message}`);

            // Secondary method: Simple GET fallback for the 'openai' attempt
            if (model === 'openai') {
                try {
                    console.log("Trying GET fallback...");
                    const encodedPrompt = encodeURIComponent(`${systemPrompt}\n\nContent: ${cleanContent.substring(0, 800)}`);
                    const getResponse = await axios.get(`${POLLINATIONS_URL}${encodedPrompt}?model=openai&cache=true`, {
                        timeout: 15000
                    });

                    if (getResponse.data && typeof getResponse.data === 'string' && getResponse.data.trim().length > 5) {
                        return getResponse.data.trim();
                    }
                } catch (getErr) {
                    console.error("GET fallback failed:", getErr.message);
                }
            }
        }
    }

    console.error("All AI strategies failed.");
    return null;
};

/**
 * Improves article content based on specific technical authoring actions.
 */
const improveContent = async (content, action) => {
    let systemPrompt = "You are a senior technical writer. ";

    switch (action) {
        case 'rewrite':
            systemPrompt += "Rewrite this text to be more professional and clear. Preserve all HTML tags and technical terms. Return ONLY the edited text.";
            break;
        case 'concise':
            systemPrompt += "Make this text more concise. Keep all HTML tags and technical details. Return ONLY the shortened version.";
            break;
        case 'grammar':
            systemPrompt += "CRITICAL TASK: Fix every single grammar, spelling, and punctuation error in the text below. Do NOT change the meaning or remove any HTML tags. Return ONLY the perfectly corrected text.";
            break;
        default:
            return content;
    }

    const result = await callPollinations(systemPrompt, content);
    return result || content;
};

/**
 * Generates a professional abstract for technical articles.
 */
const generateSummary = async (content) => {
    const systemPrompt = "Write a short 1-2 sentence technical summary of this article. Return ONLY the summary.";
    const result = await callPollinations(systemPrompt, content);
    return result || content.substring(0, 150) + '...';
};

/**
 * Suggests an impactful technical title based on the article's core theme.
 */
const suggestTitle = async (content) => {
    const systemPrompt = "Suggest one short, punchy technical title for this text. Return ONLY the title, no quotes.";
    const result = await callPollinations(systemPrompt, content);
    return result ? result.replace(/^"|"$/g, '') : "Technical Insight";
};

module.exports = {
    improveContent,
    generateSummary,
    suggestTitle,
};
