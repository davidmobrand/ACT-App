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

// Load prompts from external file
const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, 'prompts.json'), 'utf8'));

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
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: getSystemPrompt(language) },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

const PORT = 9090;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 