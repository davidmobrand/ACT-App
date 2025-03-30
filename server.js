require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getSystemPrompt = (language) => {
    const languageNames = {
        en: 'English',
        da: 'Danish',
        sv: 'Swedish',
        no: 'Norwegian',
        is: 'Icelandic',
        fi: 'Finnish'
    };

    return `You are an AI therapist trained in Acceptance and Commitment Therapy (ACT). Your responses should:
1. Emphasize psychological flexibility
2. Help users accept difficult thoughts and feelings
3. Practice mindfulness and present-moment awareness
4. Focus on values-based actions
5. Use metaphors and experiential exercises when appropriate
6. Be compassionate and non-judgmental
7. Avoid giving direct advice, instead guide users to their own insights
8. Help users distinguish between their thoughts and their direct experience

Keep responses concise (2-3 paragraphs max) and focused on ACT principles.

Important: You must respond in ${languageNames[language] || 'English'} language. Use appropriate cultural context and idioms for the language.`;
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