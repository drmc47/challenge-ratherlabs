"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPair = void 0;
const checkPair = (req, res, next) => {
    const { pair } = req.query;
    if (pair.toString().toUpperCase() === 'BTCUSD' ||
        pair.toString().toUpperCase() === 'ETHUSD') {
        next();
    }
    else {
        return res
            .send({ message: 'Not a valid pair, choose between ETHUSD or BTCUSD' })
            .status(412);
    }
};
exports.checkPair = checkPair;
//# sourceMappingURL=checkPair.js.map