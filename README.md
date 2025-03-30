# ACT Therapy Assistant

A minimal, lightweight chatbot that provides guidance based on Acceptance and Commitment Therapy (ACT) principles. This application offers a simple interface for interacting with an AI assistant trained to provide ACT-based support.

## Features

- Simple, clean chat interface
- Real-time message interactions
- ACT-focused responses
- Lightweight implementation

## Technologies Used

- Frontend: Plain HTML, CSS, JavaScript
- Backend: Node.js, Express
- AI: OpenAI GPT-3.5

## Deployment Instructions

### 1. Fork and Clone
1. Fork this repository to your GitHub account
2. Clone your forked repository locally

### 2. Set Up Vercel
1. Create a [Vercel account](https://vercel.com/signup) (free)
2. Install Vercel CLI: `npm i -g vercel`
3. Login to Vercel: `vercel login`

### 3. Configure Environment Variables
1. In your Vercel dashboard, go to your project settings
2. Add the following environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key

### 4. Deploy
1. Run `vercel` in the project directory
2. Follow the prompts to deploy
3. Your app will be available at the provided URL

## Development

The application uses a minimal tech stack for simplicity and ease of maintenance:

- `index.html`: Frontend interface with embedded CSS and JavaScript
- `server.js`: Express server handling OpenAI API interactions

To run locally:
1. Install dependencies: `npm install`
2. Create a `.env` file with your OpenAI API key
3. Run the server: `node server.js`
4. Visit `http://localhost:9090`

## Project Structure
```
.
├── index.html      # Frontend chat interface
├── server.js       # Backend Express server
├── vercel.json     # Vercel deployment configuration
├── .env            # Environment variables (not in repo)
└── package.json    # Project dependencies
```

## Future Improvements

- Integration with a real AI model for more sophisticated responses
- User authentication and conversation history
- More advanced ACT-specific features and exercises
- Customizable themes and accessibility options 