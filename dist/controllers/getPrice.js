"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = void 0;
const app_1 = require("../app");
const getPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { pair } = req.query;
    pair = pair.toString().toUpperCase();
    const betterBid = app_1.book[pair].bids[0];
    const betterAsk = app_1.book[pair].asks[0];
    res.send({ bestBid: betterBid, bestAsk: betterAsk });
});
exports.getPrice = getPrice;
//# sourceMappingURL=getPrice.js.map