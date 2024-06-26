"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const outlookController_1 = require("../controllers/outlookController");
const router = (0, express_1.Router)();
router.get('/auth', outlookController_1.authUrl);
router.get('/callback', outlookController_1.handleCallback);
router.get('/emails', outlookController_1.listEmails);
exports.default = router;
//# sourceMappingURL=outlookRoutes.js.map