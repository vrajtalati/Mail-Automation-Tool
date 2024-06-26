import { Request, Response } from 'express';
import { authUrl as gmailAuthUrl, handleCallback as gmailHandleCallback, fetchEmails as gmailFetchEmails } from '../services/gmailService';

export const authUrl = (req: Request, res: Response) => {
  const url = gmailAuthUrl();
  // console.log(url);
  res.redirect(url);
};

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    
    await gmailHandleCallback(code, req);
    res.redirect('/gmail/emails');
  } catch (error) {
    res.status(500).send('Authentication failed.');
  }
};

export const listEmails = async (req: Request, res: Response) => {
  try {
    const emails = await gmailFetchEmails(req);
    res.json(emails);
  } catch (error) {
    res.status(500).send('Failed to fetch emails.');
  }
};
