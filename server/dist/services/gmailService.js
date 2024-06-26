"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEmails = exports.handleCallback = exports.authUrl = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("../openai");
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, process.env.GMAIL_REDIRECT_URI);
const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oauth2Client });
const authUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
};
exports.authUrl = authUrl;
const handleCallback = async (code, req) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('OAuth Tokens:', tokens);
        oauth2Client.setCredentials(tokens);
        req.session.gmailToken = tokens;
    }
    catch (error) {
        console.error('Error getting OAuth tokens:', error);
    }
};
exports.handleCallback = handleCallback;
const fetchEmails = async (req) => {
    try {
        oauth2Client.setCredentials(req.session.gmailToken);
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
        });
        const messages = await Promise.all(response.data.messages?.map(async (msg) => {
            const email = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
                format: 'full',
            });
            const bodyData = email.data.payload?.parts?.find(part => part.mimeType === 'text/plain')?.body?.data;
            const body = bodyData ? Buffer.from(bodyData, 'base64').toString('utf8') : '';
            const subject = email.data.payload?.headers?.find(header => header.name === 'Subject')?.value || '';
            const category = await (0, openai_1.categorizeEmail)(subject, body);
            return {
                id: email.data.id,
                subject,
                body,
                category,
            };
        }) ?? []);
        return messages;
    }
    catch (error) {
        console.error('Error fetching emails:', error);
        throw new Error('Failed to fetch emails');
    }
};
exports.fetchEmails = fetchEmails;
//# sourceMappingURL=gmailService.js.map