const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: { 'HTTP-Referer': 'http://localhost:3000', 'X-Title': 'test' }
});

const FREE_MODELS = [
  'google/gemini-2.5-flash-free',
  'google/gemini-2.0-flash-lite-preview-02-05:free',
  'meta-llama/llama-3-8b-instruct:free',
  'mistralai/mistral-nemo-instruct-2407:free',
  'qwen/qwen-2-7b-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free'
];

async function test() {
  for (const model of FREE_MODELS) {
    try {
      console.log('Testing', model);
      const res = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Say {"test":"success"}' }]
      });
      console.log('SUCCESS for', model, res.choices[0].message.content);
    } catch (err) {
      console.error('ERROR for', model, err.message);
    }
  }
}
test();
