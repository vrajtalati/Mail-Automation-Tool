"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEmails = exports.handleCallback = exports.authUrl = void 0;
const gmailService_1 = require("../services/gmailService");
const authUrl = (req, res) => {
    const url = (0, gmailService_1.authUrl)();
    // console.log(url);
    res.redirect(url);
};
exports.authUrl = authUrl;
const handleCallback = async (req, res) => {
    try {
        const code = req.query.code;
        await (0, gmailService_1.handleCallback)(code, req);
        res.redirect('/gmail/emails');
    }
    catch (error) {
        res.status(500).send('Authentication failed.');
    }
};
exports.handleCallback = handleCallback;
const listEmails = async (req, res) => {
    try {
        const emails = await (0, gmailService_1.fetchEmails)(req);
        res.json(emails);
    }
    catch (error) {
        res.status(500).send('Failed to fetch emails.');
    }
};
exports.listEmails = listEmails;
//# sourceMappingURL=gmailController.js.map