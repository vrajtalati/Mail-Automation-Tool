import { PublicClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import { Request } from 'express';

const msalConfig = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}`,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET!,
  },
};

const msalClient = new PublicClientApplication(msalConfig);

export const authUrl = async () => {
  const authUrl = await msalClient.getAuthCodeUrl({
    scopes: ['https://graph.microsoft.com/Mail.Read'],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI!,
  });
  return authUrl;
};

export const handleCallback = async (code: string, req: Request) => {
  const tokenResponse = await msalClient.acquireTokenByCode({
    code,
    scopes: ['https://graph.microsoft.com/Mail.Read'],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI!,
  });
  req.session.outlookToken = tokenResponse.accessToken;
};

export const fetchEmails = async (req: Request) => {
  const client = Client.init({
    authProvider: (done) => {
      done(null, req.session.outlookToken);
    },
  });

  const messages = await client.api('/me/messages').get();

  const emails = messages.value.map((message: any) => ({
    id: message.id,
    subject: message.subject,
    body: message.body.content,
  }));

  return emails;
};
