"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEmails = exports.handleCallback = exports.authUrl = void 0;
const msal_node_1 = require("@azure/msal-node");
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const msalConfig = {
    auth: {
        clientId: process.env.OUTLOOK_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}`,
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    },
};
const msalClient = new msal_node_1.PublicClientApplication(msalConfig);
const authUrl = async () => {
    const authUrl = await msalClient.getAuthCodeUrl({
        scopes: ['https://graph.microsoft.com/Mail.Read'],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    });
    return authUrl;
};
exports.authUrl = authUrl;
const handleCallback = async (code, req) => {
    const tokenResponse = await msalClient.acquireTokenByCode({
        code,
        scopes: ['https://graph.microsoft.com/Mail.Read'],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    });
    req.session.outlookToken = tokenResponse.accessToken;
};
exports.handleCallback = handleCallback;
const fetchEmails = async (req) => {
    const client = microsoft_graph_client_1.Client.init({
        authProvider: (done) => {
            done(null, req.session.outlookToken);
        },
    });
    const messages = await client.api('/me/messages').get();
    const emails = messages.value.map((message) => ({
        id: message.id,
        subject: message.subject,
        body: message.body.content,
    }));
    return emails;
};
exports.fetchEmails = fetchEmails;
//# sourceMappingURL=outlookService.js.map