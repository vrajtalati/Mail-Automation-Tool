import { Request, Response } from 'express';
import { authUrl as outlookAuthUrl, handleCallback as outlookHandleCallback, fetchEmails as outlookFetchEmails } from '../services/outlookService';

export const authUrl = (req: Request, res: Response) => {
  outlookAuthUrl().then(url => res.redirect(url));
};

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    await outlookHandleCallback(code, req);
    res.redirect('/outlook/emails');
  } catch (error) {
    res.status(500).send('Authentication failed.');
  }
};

export const listEmails = async (req: Request, res: Response) => {
  try {
    const emails = await outlookFetchEmails(req);
    res.json(emails);
  } catch (error) {
    res.status(500).send('Failed to fetch emails.');
  }
};
