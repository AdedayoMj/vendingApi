"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controller/user"));
const checkJWT_1 = __importDefault(require("../middleware/checkJWT"));
const checkRole_1 = __importDefault(require("../middleware/checkRole"));
const router = express_1.default.Router();
router.get('/validate', checkJWT_1.default, user_1.default.validateToken);
router.post('/login', user_1.default.loginUser);
router.post('/register', user_1.default.registerUser);
router.get('/findUser/:userID', checkJWT_1.default, user_1.default.findUser);
router.put('/updateUser/:userID', checkJWT_1.default, (0, checkRole_1.default)('updateAny', 'updateUser'), user_1.default.update);
router.delete('/deleteUser/:userID', checkJWT_1.default, user_1.default.deleteUserData);
router.get('/getAllUsers', user_1.default.getAllUsers);
module.exports = router;
//# sourceMappingURL=user.js.map