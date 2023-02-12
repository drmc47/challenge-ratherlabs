"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.book = void 0;
const ws_1 = __importDefault(require("ws"));
const findIndex_1 = __importDefault(require("../src/utils/findIndex"));
const ws = new ws_1.default('wss://api-pub.bitfinex.com/ws/2');
const pairs = {
    ETHUSD: 'ETHUSD',
    BTCUSD: 'BTCUSD',
};
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
exports.book = {
    BTCUSD: {
        bids: [],
        asks: [],
    },
    ETHUSD: {
        bids: [],
        asks: [],
    },
};
ws.onopen = () => {
    ws.send(msg1);
    ws.send(msg2);
};
ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    // console.log(data);
    const chanId = { BTCUSD: 0, ETHUSD: 0 };
    if (data.event) {
        if (data.event === 'subscribed') {
            chanId[data.pair] = data.chanId;
        }
        //guardar el chanId, si data.pair === 'ETHUSD', chanIdETH = data.pair y lo mismo con BTC
        return;
    }
    const [channelId, orders] = data;
    const pair = chanId.BTCUSD === channelId ? pairs.BTCUSD : pairs.ETHUSD;
    if (orders.length > 3) {
        //this is the initial book
        exports.book[pair].asks = orders.filter((order) => order[2] < 0);
        exports.book[pair].bids = orders.filter((order) => order[2] > 0);
        return;
    }
    else {
        //this is an update
        console.log(`actualizacion de ${pair}`, orders);
        const orderType = orders[2] > 0 ? 'bids' : 'asks';
        if (orders === 'hb')
            return;
        const foundIdx = (0, findIndex_1.default)(orders, pair, orderType, exports.book);
        if (foundIdx > -1) {
            //found the price
            if (orders[1] === 0) {
                //i have to delete the price
                console.log('hay que eliminar el price', orders[0]);
                exports.book[pair][orderType] = exports.book[pair][orderType].filter((item) => item[0] !== orders[0]);
                console.log('eliminao');
            }
            else {
                // not 0, add to the book
                exports.book[pair][orderType][foundIdx] = orders;
            }
            console.log(`BOOK ${pair} ACTUALIZAO con nuevo ${orderType}`, exports.book[pair][orderType]);
        }
        else {
            exports.book[pair][orderType].push(orders);
        }
        return;
    }
};
//# sourceMappingURL=index.js.map