"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controller/auth"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = express_1.default.Router();
router.post('/login', auth_1.default.loginUser);
router.post('/register', auth_1.default.registerUser);
router.post('/logout', verifyToken_1.default, auth_1.default.logOut);
module.exports = router;
//# sourceMappingURL=auth.js.map