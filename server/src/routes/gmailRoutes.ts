import { Router } from 'express';
import { authUrl, handleCallback, listEmails } from '../controllers/gmailController';

const router = Router();

router.get('/auth', authUrl);
router.get('/callback', handleCallback);
router.get('/emails', listEmails);

export default router;
