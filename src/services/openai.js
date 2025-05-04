import axios from 'axios';


const API_KEY ='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';
const API_URL = 'https://api.openai.com/v1/chat/completions';


const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

// Max retry attempts to avoid infinite looping
const MAX_RETRIES = 3;

async function callOpenAI(prompt, retries = 0) {
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  };

  try {
    console.log('Sending request to OpenAI API...');
    console.log('Request body:', JSON.stringify(body, null, 2));  // Log the request body

    // Making the request to OpenAI API
    const response = await axios.post(API_URL, body, { headers });

    // Log response status and headers for debugging
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    // Log the successful API response content
    console.log('API Response:', response.data);
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    if (error.response) {
      // Log the error response
      console.error('Error response:', error.response);

      // Handle rate limit error (status code 429)
      if (error.response.status === 429) {
        if (retries >= MAX_RETRIES) {
          console.log('Maximum retries reached. Aborting...');
          return 'Rate limit exceeded. Please try again later.';
        }
        
        console.log('Rate limit exceeded. Retrying...');
        console.log('Rate limit reset time:', error.response.headers['x-ratelimit-reset']);
        console.log('Rate limit remaining:', error.response.headers['x-ratelimit-remaining']);
        
        // Retry after a delay (5 seconds)
        await new Promise(resolve => setTimeout(resolve, 5000));
        return await callOpenAI(prompt, retries + 1);  // Retry the request
      }
    } else {
      // Log unexpected errors (e.g., network issues, etc.)
      console.error('Unexpected error:', error);
    }
    throw error; // Rethrow the error to propagate it
  }
}

// Function to generate title suggestion
export async function getTitleSuggestion(content) {
  console.log('Generating title suggestion...');
  return await callOpenAI(`Generate a catchy blog post title for the following content:\n\n${content}`);
}

// Function to summarize blog content
export async function summarizeText(content) {
  console.log('Summarizing content...');
  return await callOpenAI(`Summarize the following blog content:\n\n${content}`);
}

// Function to suggest keywords
export async function suggestKeywords(content) {
  console.log('Suggesting keywords...');
  return await callOpenAI(`Suggest 5 relevant SEO keywords for the following blog content:\n\n${content}`);
}
                                                                                                                                                                                                                                                                                                                                                                                          