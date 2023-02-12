"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const getPrice_1 = require("./controllers/getPrice");
const effectivePrice_1 = require("./controllers/effectivePrice");
const checkPair_1 = require("./middlewares/checkPair");
const handleMessage_1 = require("./utils/handleMessage");
const app = (0, express_1.default)();
const ws = new ws_1.default('wss://api-pub.bitfinex.com/ws/2');
const msg1 = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
});
const msg2 = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tETHUSD',
});
ws.onopen = () => {
    ws.send(msg1);
    ws.send(msg2);
};
ws.onmessage = (msg) => (0, handleMessage_1.handleMessage)(msg);
app.use('/api', checkPair_1.checkPair);
app.get('/', (_req, res) => {
    res.sendStatus(200);
});
app.get('/api/price', getPrice_1.getPrice);
app.get('/api/calcprice', effectivePrice_1.effectivePrice);
exports.default = app;
//# sourceMappingURL=app.js.map