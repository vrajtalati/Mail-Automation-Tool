import { google } from 'googleapis';
import { Request } from 'express';
import dotenv from 'dotenv';
import { categorizeEmail } from '../openai';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export const authUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
};

export const handleCallback = async (code: string, req: Request) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('OAuth Tokens:', tokens);
    oauth2Client.setCredentials(tokens);
    req.session.gmailToken = tokens;
  } catch (error) {
    console.error('Error getting OAuth tokens:', error);
  }
};

export const fetchEmails = async (req: Request) => {
  try {
    oauth2Client.setCredentials(req.session.gmailToken);
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = await Promise.all(
      response.data.messages?.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'full',
        });

        const bodyData = email.data.payload?.parts?.find(
          part => part.mimeType === 'text/plain'
        )?.body?.data;

        const body = bodyData ? Buffer.from(bodyData, 'base64').toString('utf8') : '';
        const subject = email.data.payload?.headers?.find(header => header.name === 'Subject')?.value || '';

        const category = await categorizeEmail(subject, body);

        return {
          id: email.data.id,
          subject,
          body,
          category,
        };
      }) ?? []
    );

    return messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error('Failed to fetch emails');
  }
};
