"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gmailController_1 = require("../controllers/gmailController");
const router = (0, express_1.Router)();
router.get('/auth', gmailController_1.authUrl);
router.get('/callback', gmailController_1.handleCallback);
router.get('/emails', gmailController_1.listEmails);
exports.default = router;
//# sourceMappingURL=gmailRoutes.js.map