const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: { 'HTTP-Referer': 'http://localhost:3000', 'X-Title': 'MediSumm' }
});

// ========== TEST 1: PDF/Image Summarization (OpenRouter) ==========
async function testSummarize() {
  console.log('━━━ TEST 1: PDF/Image Summarization (OpenRouter) ━━━');
  const models = [
    'google/gemma-3-27b-it:free',
    'google/gemma-4-31b-it:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'minimax/minimax-m2.5:free',
    'openrouter/free',
  ];

  const prompt = `You are a medical report explainer. Respond ONLY as valid JSON:
  {"summary_text": "Test summary", "abnormal_flags": [], "citations": [], "next_steps": ["step1","step2","step3"]}`;

  for (const model of models) {
    try {
      console.log(`  Trying ${model}...`);
      const res = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a medical report explainer. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      });
      const content = res.choices[0].message.content;
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.summary_text) {
          console.log(`  ✅ SUCCESS with ${model}`);
          console.log(`     summary_text: "${parsed.summary_text.substring(0, 60)}..."`);
          return true;
        }
      }
      console.log(`  ⚠️ Invalid JSON from ${model}`);
    } catch (err) {
      console.log(`  ❌ ${model}: ${err.status} ${err.message?.substring(0, 80)}`);
    }
  }
  console.log('  ❌ ALL MODELS FAILED');
  return false;
}

// ========== TEST 2: Audio Summary (OpenRouter - same API) ==========
async function testAudioSummary() {
  console.log('\n━━━ TEST 2: Audio Summary (OpenRouter) ━━━');
  const prompt = `Summarize this transcript into JSON:
  {"title":"Test","summary":"A test conversation","key_points":["point1"],"action_items":["action1"]}
  
  TRANSCRIPT: "Doctor said blood pressure is 120 over 80 which is normal. Patient should continue current medication."`;

  try {
    const res = await openai.chat.completions.create({
      model: 'google/gemma-4-31b-it:free',
      messages: [
        { role: 'system', content: 'Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });
    const content = res.choices[0].message.content;
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed.title && parsed.summary) {
        console.log(`  ✅ SUCCESS`);
        console.log(`     title: "${parsed.title}"`);
        return true;
      }
    }
    console.log('  ⚠️ Invalid JSON response');
    return false;
  } catch (err) {
    console.log(`  ❌ ERROR: ${err.status} ${err.message?.substring(0, 100)}`);
    return false;
  }
}

// ========== TEST 3: Audio Transcription (AssemblyAI) ==========
async function testAssemblyAI() {
  console.log('\n━━━ TEST 3: Audio Transcription (AssemblyAI Key Check) ━━━');
  const key = process.env.ASSEMBLYAI_API_KEY;
  if (!key) {
    console.log('  ❌ ASSEMBLYAI_API_KEY is missing');
    return false;
  }

  // Just check if the key authenticates (list transcripts endpoint)
  return new Promise((resolve) => {
    const https = require('https');
    const opt = {
      hostname: 'api.assemblyai.com',
      path: '/v2/transcript?limit=1',
      headers: { 'Authorization': key }
    };
    https.get(opt, (r) => {
      let d = '';
      r.on('data', c => { d += c });
      r.on('end', () => {
        if (r.statusCode === 200) {
          console.log('  ✅ SUCCESS - AssemblyAI key is valid');
          resolve(true);
        } else {
          console.log(`  ❌ ERROR: ${r.statusCode} ${d.substring(0, 100)}`);
          resolve(false);
        }
      });
    }).on('error', (e) => {
      console.log(`  ❌ ERROR: ${e.message}`);
      resolve(false);
    });
  });
}

// ========== RUN ALL ==========
async function runAll() {
  console.log('🔍 MediSumm Feature Verification\n');
  const r1 = await testSummarize();
  const r2 = await testAudioSummary();
  const r3 = await testAssemblyAI();

  console.log('\n━━━ RESULTS ━━━');
  console.log(`PDF/Image Summary:   ${r1 ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`Audio Summary:       ${r2 ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`Audio Transcription: ${r3 ? '✅ WORKING' : '❌ BROKEN'}`);
}
runAll();
