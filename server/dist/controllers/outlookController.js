"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEmails = exports.handleCallback = exports.authUrl = void 0;
const outlookService_1 = require("../services/outlookService");
const authUrl = (req, res) => {
    (0, outlookService_1.authUrl)().then(url => res.redirect(url));
};
exports.authUrl = authUrl;
const handleCallback = async (req, res) => {
    try {
        const code = req.query.code;
        await (0, outlookService_1.handleCallback)(code, req);
        res.redirect('/outlook/emails');
    }
    catch (error) {
        res.status(500).send('Authentication failed.');
    }
};
exports.handleCallback = handleCallback;
const listEmails = async (req, res) => {
    try {
        const emails = await (0, outlookService_1.fetchEmails)(req);
        res.json(emails);
    }
    catch (error) {
        res.status(500).send('Failed to fetch emails.');
    }
};
exports.listEmails = listEmails;
//# sourceMappingURL=outlookController.js.map