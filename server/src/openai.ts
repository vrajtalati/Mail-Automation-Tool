import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const categorizeEmail = async (subject: string, body: string) => {
  const prompt = `Email Subject: ${subject}\nEmail Body: ${body}\n\nCategorize this email as follows:\na. Interested\nb. Not Interested\nc. More information\n\nCategory:`;

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  };

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
      const category = response.choices[0]?.message?.content?.trim();

      if (category) {
        return category;
      } else {
        throw new Error('Failed to categorize email');
      }
    } catch (error:any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response?.headers['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : attempt * 1000;
        console.error(`Rate limit exceeded. Retrying after ${delay}ms...`);
        await sleep(delay);
      } else {
        console.error('Error categorizing email:', error);
        throw error;
      }
    }
  }

  throw new Error('Failed to categorize email after multiple attempts');
};
