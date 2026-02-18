# Synthia - Synthetic Customer Platform

A multi-tenant SaaS platform where companies can interact with AI-based synthetic customer personas via chat.

## 🏗 Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Supabase (EU region), PostgreSQL, Row Level Security (RLS)
- **AI**: OpenAI API (EU endpoint)

## 🚀 Getting Started

### Prerequisites

1. Create a Supabase project in the EU region
2. Get your OpenAI API key with access to GPT-4
3. Set up environment variables

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

Run the migration in `supabase/migrations/001_initial_schema.sql` to create the database schema with RLS policies.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📊 Database Schema

- **companies**: Company information with branding
- **personas**: AI customer personas (max 3 per company)
- **conversations**: Chat sessions per persona
- **messages**: Individual chat messages

## 🔐 Multi-Tenant Architecture

- Company-level authentication via Supabase Auth
- Row Level Security ensures complete data isolation
- Each company can only access their own data

## 🤖 AI Features

- Persona-driven conversations using OpenAI GPT-4
- Context-aware responses based on persona parameters
- Company public context integration
- No data training or prompt logging

## 🎨 UI Features

- Clean, professional interface
- Company branding (logo, primary color)
- Modern chat UI with conversation history
- Responsive design

## 🚫 Privacy Constraints

- EU hosting only
- No scraping or document ingestion
- No advanced analytics
- No data sharing between companies
- No use of company data for AI training

## 📝 License

This is a lean validation MVP for synthetic customer interactions.
