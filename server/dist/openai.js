"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeEmail = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env['OPENAI_API_KEY'],
});
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const categorizeEmail = async (subject, body) => {
    const prompt = `Email Subject: ${subject}\nEmail Body: ${body}\n\nCategorize this email as follows:\na. Interested\nb. Not Interested\nc. More information\n\nCategory:`;
    const params = {
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    };
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            const response = await openai.chat.completions.create(params);
            const category = response.choices[0]?.message?.content?.trim();
            if (category) {
                return category;
            }
            else {
                throw new Error('Failed to categorize email');
            }
        }
        catch (error) {
            if (error.response?.status === 429) {
                const retryAfter = error.response?.headers['retry-after'];
                const delay = retryAfter ? parseInt(retryAfter) * 1000 : attempt * 1000;
                console.error(`Rate limit exceeded. Retrying after ${delay}ms...`);
                await sleep(delay);
            }
            else {
                console.error('Error categorizing email:', error);
                throw error;
            }
        }
    }
    throw new Error('Failed to categorize email after multiple attempts');
};
exports.categorizeEmail = categorizeEmail;
//# sourceMappingURL=openai.js.map