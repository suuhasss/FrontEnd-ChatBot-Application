# AI Chat Application

A real-time chat application with an integrated AI chatbot built using HTML, CSS, and JavaScript. The application uses the OpenRouter API to power the AI responses.

## Features

- Clean and modern chat interface
- Real-time message updates
- AI-powered responses using DeepHermes model
- Typing indicators
- Responsive design
- Auto-expanding message input
- Dark/Light theme support

## Setup

1. Clone this repository to your local machine
2. Get a free API key from [OpenRouter](https://openrouter.ai/):
   - Create an account at openrouter.ai
   - Go to your dashboard
   - Navigate to "API Keys"
   - Create a new API key
3. Open `script.js` and replace the `API_KEY` value with your OpenRouter API key:
   ```javascript
   const API_KEY = "your-api-key-here";
   ```
4. Open `index.html` in your web browser

## Usage

1. Type your message in the input field at the bottom of the chat
2. Press Enter or click the Send button to send your message
3. Wait for the AI to respond
4. The chat history will be maintained during your session

## Technical Details

- The application uses the DeepHermes model (nousresearch/deephermes-3-mistral-24b-preview) through the OpenRouter API
- Messages are displayed in real-time with a typing indicator while waiting for AI responses
- The interface is fully responsive and works on both desktop and mobile devices
- Features a modern glass-morphism design with blur effects

## Note

The OpenRouter API has rate limits for free accounts. If you need more requests, consider upgrading to a paid plan or implementing rate limiting in the application.

## License

This project is open source and available under the MIT License.
