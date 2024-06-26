import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import gmailRoutes from './routes/gmailRoutes';
import outlookRoutes from './routes/outlookRoutes';

dotenv.config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/gmail', gmailRoutes);
app.use('/outlook', outlookRoutes);

export default app;
