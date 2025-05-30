require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Load prompts and translations from external files
const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, 'prompts.json'), 'utf8'));
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'translations.json'), 'utf8'));

// Add endpoint to get translations for a specific language
app.get('/translations/:lang', (req, res) => {
    const lang = req.params.lang;
    if (translations[lang]) {
        res.json(translations[lang]);
    } else {
        res.json(translations.en); // Default to English
    }
});

const getSystemPrompt = (language) => {
    const { 
        actPrinciples, 
        responseGuidelines, 
        languages,
        therapeuticGuidelines,
        commonThemes 
    } = prompts;
    
    return `${responseGuidelines.role}

${actPrinciples.map((principle, index) => `${index + 1}. ${principle}`).join('\n')}

CONVERSATION GUIDELINES:
${therapeuticGuidelines.conversationStyle.map(style => `- ${style}`).join('\n')}

RESPONSE STRUCTURE:
- Opening: ${responseGuidelines.structure.opening}
- Middle: ${responseGuidelines.structure.middle}
- Closing: ${responseGuidelines.structure.closing}

THERAPEUTIC TOOLS:
Metaphors (use when appropriate):
${therapeuticGuidelines.usefulMetaphors.map(metaphor => `- ${metaphor}`).join('\n')}

Intervention Techniques:
${therapeuticGuidelines.interventionTechniques.map(technique => `- ${technique}`).join('\n')}

CRISIS AWARENESS:
If you detect any of these warning signs:
${therapeuticGuidelines.crisisGuidelines.warningSigns.map(sign => `- ${sign}`).join('\n')}
Respond with: ${therapeuticGuidelines.crisisGuidelines.response}

TIMING AND PACING:
- ${responseGuidelines.timing.pacing}
- ${responseGuidelines.timing.depth}

${responseGuidelines.style}

Important: You must respond in ${languages[language] || 'English'} language. Use appropriate cultural context and idioms for the language.`;
};

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const language = req.body.language || 'en';
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: getSystemPrompt(language) },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ 
            error: 'An error occurred',
            details: error.message 
        });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 