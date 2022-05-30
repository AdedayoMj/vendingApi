"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controller/user"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verifyRole_1 = __importDefault(require("../middleware/verifyRole"));
const role_1 = __importDefault(require("../_helpers/role"));
const router = express_1.default.Router();
router.get('/findUser', verifyToken_1.default, user_1.default.findUser);
router.put('/updateUser/:userID', verifyToken_1.default, (0, verifyRole_1.default)(role_1.default.buyer, role_1.default.seller), user_1.default.update);
router.delete('/deleteUser/:userID', verifyToken_1.default, user_1.default.deleteUserData);
router.get('/getAllUsers', user_1.default.getAllUsers);
module.exports = router;
//# sourceMappingURL=user.js.map