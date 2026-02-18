import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1', // EU endpoint will be configured via environment
})

export default openai
