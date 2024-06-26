"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const gmailRoutes_1 = __importDefault(require("./routes/gmailRoutes"));
const outlookRoutes_1 = __importDefault(require("./routes/outlookRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/gmail', gmailRoutes_1.default);
app.use('/outlook', outlookRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map