import axios from 'axios';

const API_URL = process.env.API_KEY;
const API_KEY = process.env.API_URL;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

const MAX_RETRIES = 3;

async function callOpenAI(prompt, setStatus, retries = 0) {
  if (!prompt || prompt.trim() === '') {
    setStatus?.('Empty content. Skipping request.');
    return 'No content provided.';
  }

  const body = {
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  };

  try {
    setStatus?.('Sending request to OpenAI API...');
    const response = await axios.post(API_URL, body, { headers });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    if (error.response && error.response.status === 429 && retries < MAX_RETRIES) {
      setStatus?.(`Rate limited. Retrying... (${retries + 1})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** retries)));
      return await callOpenAI(prompt, setStatus, retries + 1);
    }

    setStatus?.('An error occurred.');
    return 'Something went wrong.';
  }
}

export async function getTitleSuggestion(content, setStatus) {
  setStatus?.('Generating title suggestion...');
  return await callOpenAI(`Generate a catchy blog post title:\n\n${content}`, setStatus);
}

export async function summarizeText(content, setStatus) {
  setStatus?.('Summarizing content...');
  return await callOpenAI(`Summarize the blog content:\n\n${content}`, setStatus);
}

export async function suggestKeywords(content, setStatus) {
  setStatus?.('Suggesting keywords...');
  return await callOpenAI(`Suggest 5 relevant SEO keywords for the content:\n\n${content}`, setStatus);
}
