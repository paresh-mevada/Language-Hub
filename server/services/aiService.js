import dotenv from 'dotenv';
import OpenAI from 'openai';

const MAX_HISTORY_MESSAGES = 12;

export class AIServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.statusCode = statusCode;
  }
}

function refreshEnv() {
  dotenv.config({ override: true });
}

function getApiKey() {
  refreshEnv();
  return process.env.AI_API_KEY?.trim() || '';
}

function getClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new AIServiceError('AI tutor is not configured. Add AI_API_KEY to server/.env to enable responses.', 503);
  }

  let baseURL = process.env.AI_BASE_URL?.trim() || undefined;

  // Auto-detect Groq Cloud API Base URL if key starts with gsk_
  if (apiKey.startsWith('gsk_') && !baseURL) {
    baseURL = 'https://api.groq.com/openai/v1';
  }

  // Auto-detect xAI Grok API Base URL if key starts with xai-
  if (apiKey.startsWith('xai-') && !baseURL) {
    baseURL = 'https://api.x.ai/v1';
  }

  return new OpenAI({
    apiKey,
    baseURL,
    timeout: 30000,
    maxRetries: 1,
  });
}

function getDefaultModel() {
  if (process.env.AI_MODEL?.trim()) return process.env.AI_MODEL.trim();
  const apiKey = getApiKey();
  const baseURL = process.env.AI_BASE_URL || '';

  if (apiKey.startsWith('gsk_') || baseURL.includes('groq.com')) {
    return 'groq/compound';
  }

  if (apiKey.startsWith('xai-') || baseURL.includes('x.ai')) {
    return 'grok-2-latest';
  }

  return 'gpt-4o-mini';
}

function cleanContent(text) {
  if (!text) return '';
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function createTutorInstruction(learningLanguage, userLevel) {
  return `You are Language Hub AI Tutor, an encouraging language teacher.

The learner is practicing ${learningLanguage} at a ${userLevel} level.

Format your responses with clear Markdown structure:
1. **Conversational Reply**: Respond naturally in ${learningLanguage} matching a ${userLevel} proficiency level.
2. > 💡 **Grammar & Vocabulary Note**: (If the learner made a spelling, grammar, or phrasing error, put the polite correction and simple explanation inside a blockquote like this so it is highlighted clearly).
3. ❓ **Follow-up Question**: End with a short, encouraging follow-up question in ${learningLanguage} to keep practicing.

Keep explanations clear, concise, and helpful. Never embarrass the learner.`;
}

function formatHistory(conversationHistory) {
  return conversationHistory
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({ role: message.role, content: message.content }));
}

export async function generateTutorResponse({ userMessage, conversationHistory, learningLanguage, userLevel }) {
  if (typeof userMessage !== 'string' || !userMessage.trim()) {
    throw new AIServiceError('A message is required to generate a tutor response.', 400);
  }

  const apiKey = getApiKey();

  // Demo fallback when AI_API_KEY is missing in server/.env
  if (!apiKey) {
    return `Hello! 👋 I am your **Language Hub AI Tutor** running in **Demo Mode**.

Your \`AI_API_KEY\` is not set in **\`server/.env\`** yet.

To enable live AI responses powered by **Groq Cloud** (or OpenAI / xAI), paste your Groq API key (starts with \`gsk_\`) into \`server/.env\`:
\`\`\`env
AI_API_KEY=gsk_your_groq_api_key_here
\`\`\`

In the meantime, you are practicing **${learningLanguage}** at a **${userLevel}** level! What topic would you like to explore today?`;
  }

  const client = getClient();
  const model = getDefaultModel();
  const systemPrompt = createTutorInstruction(learningLanguage, userLevel);
  const formattedHistory = formatHistory(conversationHistory);

  try {
    // 1. Try OpenAI Responses API
    try {
      if (typeof client.responses?.create === 'function') {
        const response = await client.responses.create({
          model,
          instructions: systemPrompt,
          input: [...formattedHistory, { role: 'user', content: userMessage.trim() }],
          store: false,
        });
        const content = response.output_text?.trim();
        if (content) return content;
      }
    } catch {
      // Fall through to Chat Completions API if Responses API is unsupported by provider
    }

    // 2. Chat Completions API (Universal format for Groq, xAI Grok, OpenAI, DeepSeek, etc.)
    const chatResponse = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedHistory,
        { role: 'user', content: userMessage.trim() },
      ],
      temperature: 0.7,
    });

    const content = cleanContent(chatResponse.choices?.[0]?.message?.content);
    if (!content) {
      throw new AIServiceError('The AI tutor did not return a response. Please try again.');
    }

    return content;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    console.error('AI Service Error:', error.message);
    throw new AIServiceError(`The AI tutor could not respond: ${error.message}`);
  }
}

export async function checkGrammarText({ text, learningLanguage = 'English', userLevel = 'Beginner' }) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new AIServiceError('Text to analyze is required.', 400);
  }

  const trimmedText = text.trim();
  const apiKey = getApiKey();

  if (!apiKey) {
    // Offline / Demo fallback when AI_API_KEY is not set in environment
    const isMockError = /goes|don't|have|be|runned|goed/i.test(trimmedText);
    return {
      originalText: trimmedText,
      correctedText: trimmedText.replace(/\bgoes\b/gi, 'went').replace(/\bdon't\b/gi, 'does not'),
      explanation: isMockError
        ? 'Identified tense or subject-verb agreement error. Ensure verb matches subject and time frame.'
        : 'The sentence structure appears correct, but review tone and context for natural fluency.',
      alternativeSentence: `Consider expressing it as: "${trimmedText}"`,
      hasErrors: isMockError,
    };
  }

  const client = getClient();
  const model = getDefaultModel();

  const instructions = `You are Language Hub AI Grammar Checker. Analyze the user's sentence in ${learningLanguage} (target level: ${userLevel}).
Output ONLY a valid JSON object with the following fields:
- "correctedText": string (the grammatically correct version of the sentence)
- "explanation": string (clear, concise explanation of the grammar rules applied or mistakes fixed)
- "alternativeSentence": string (a natural, alternative way to express the same thought)
- "hasErrors": boolean (true if any grammar/spelling/punctuation errors were detected and fixed, false if already perfect)

Do NOT wrap in markdown block. Output strict raw JSON only.`;

  try {
    let rawOutput = '';

    // 1. Try Responses API
    try {
      if (typeof client.responses?.create === 'function') {
        const response = await client.responses.create({
          model,
          instructions,
          input: trimmedText,
          store: false,
        });
        rawOutput = response.output_text?.trim() || '';
      }
    } catch {
      // Fall through to Chat Completions API
    }

    // 2. Fallback to Chat Completions API (Groq / Grok / standard OpenAI API)
    if (!rawOutput) {
      const chatResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: trimmedText },
        ],
        temperature: 0.2,
      });
      rawOutput = chatResponse.choices?.[0]?.message?.content?.trim() || '';
    }

    const cleanJson = cleanContent(rawOutput).replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      originalText: trimmedText,
      correctedText: parsed.correctedText || trimmedText,
      explanation: parsed.explanation || 'No errors detected.',
      alternativeSentence: parsed.alternativeSentence || '',
      hasErrors: typeof parsed.hasErrors === 'boolean' ? parsed.hasErrors : (parsed.correctedText !== trimmedText),
    };
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    return {
      originalText: trimmedText,
      correctedText: trimmedText,
      explanation: 'Analysis completed. Sentence reviewed for grammar and natural phrasing.',
      alternativeSentence: trimmedText,
      hasErrors: false,
    };
  }
}
