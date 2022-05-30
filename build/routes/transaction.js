"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const transaction_1 = __importDefault(require("../controller/transaction"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verifyRole_1 = __importDefault(require("../middleware/verifyRole"));
const role_1 = __importDefault(require("../_helpers/role"));
const router = express_1.default.Router();
router.put('/deposit/:userID', verifyToken_1.default, (0, verifyRole_1.default)(role_1.default.buyer), transaction_1.default.deposit);
router.put('/reset/:userID', verifyToken_1.default, (0, verifyRole_1.default)(role_1.default.buyer), transaction_1.default.reset);
router.post('/buyProduct/:userID', verifyToken_1.default, (0, verifyRole_1.default)(role_1.default.buyer), transaction_1.default.buyProduct);
module.exports = router;
//# sourceMappingURL=transaction.js.map