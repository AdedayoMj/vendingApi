"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../controller/product"));
const checkJWT_1 = __importDefault(require("../middleware/checkJWT"));
// import checkRole from '../middleware/checkRole';
const router = express_1.default.Router();
router.get('/', product_1.default.readAllProduct);
router.get('/read/:productID', product_1.default.readProduct);
router.post('/addProduct', checkJWT_1.default, product_1.default.addProduct);
router.post('/query', checkJWT_1.default, product_1.default.query);
router.patch('/update/:statID', checkJWT_1.default, product_1.default.update);
router.delete('/:statID', product_1.default.deleteStats);
module.exports = router;
//# sourceMappingURL=product.js.map