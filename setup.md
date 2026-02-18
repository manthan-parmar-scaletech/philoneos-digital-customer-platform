# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## Getting Your Credentials

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project in the EU region
3. Navigate to Project Settings > API
4. Copy the Project URL and Anon Key

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key with access to GPT-4
3. Copy the API key

## Database Migration

Run the SQL migration in `supabase/migrations/001_initial_schema.sql` through the Supabase SQL Editor to set up the database schema and RLS policies.
