
import session from 'express-session';

// Extend the session interface
declare module 'express-session' {
  interface SessionData {
    outlookToken?: any; // Add the outlookToken property
    gmailToken?: any;   // Add the gmailToken property
  }
}
