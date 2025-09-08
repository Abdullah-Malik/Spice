# Spice - AI-Powered Brand Insights Platform

Spice is an AI-powered platform that generates comprehensive brand insights by combining real-time web search with advanced language models.

## 🚀 Features

- Generate AI-powered brand insights using real-time web data
- Conversation history and source attribution
- Modern Next.js frontend with dark theme
- Secure JWT authentication

## 🛠️ Quick Setup

### 1. Get API Keys
- **EXA API Key**: [https://dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys)
- **Gemini API Key**: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 2. Configure Environment
Add your API keys to `.env.dev`:
```bash
EXA_API_KEY=your_exa_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Application
```bash
docker-compose up --build
```

### 4. Create Account
1. Visit [http://localhost:5173/sign-up](http://localhost:5173/sign-up)
2. Create account → Auto-redirect to dashboard
3. Start generating brand insights!

## 🎯 How It Works

1. **Input**: Enter brand name, description, and prompts
2. **Search**: System searches web for relevant brand content
3. **Extract**: Scrapes and processes webpage content
4. **Analyze**: AI generates insights using web data + prompts
5. **Results**: View insights with source attribution

## 🏗️ Architecture

**Frontend**: Next.js + TypeScript + Tailwind CSS  
**Backend**: Node.js + Express + MongoDB  
**AI**: Google Gemini + Exa Search API  
**Infrastructure**: Docker containers

## 📝 Key Endpoints

- `POST /v1/insights/` - Generate insights
- `GET /v1/insights/user/me` - Get user history
- `POST /v1/auth/signup` - Register user
- `POST /v1/auth/login` - Authenticate user

## 🐳 Services

- **MongoDB**: Database (port 27017)
- **Insights API**: Backend service (port 3000)
- **Webapp**: Frontend (port 5173)

Perfect for marketing teams, brand managers, and competitive intelligence.