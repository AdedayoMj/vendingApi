"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkArray = void 0;
const money = {
    5: true,
    10: true,
    20: true,
    50: true,
    100: true
};
const checkArray = (deposit) => {
    return deposit in money;
};
exports.checkArray = checkArray;
//# sourceMappingURL=checkArray.js.map