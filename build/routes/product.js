"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../controller/product"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verifyRole_1 = __importDefault(require("../middleware/verifyRole"));
const role_1 = __importDefault(require("../_helpers/role"));
const router = express_1.default.Router();
router.get('/getAllProducts', product_1.default.getAllProduct);
router.get('/findProduct/:productID', product_1.default.findProduct);
router.post('/addProduct', verifyToken_1.default, product_1.default.upload.single('productImage'), (0, verifyRole_1.default)(role_1.default.seller), product_1.default.addProduct);
router.put('/updateProduct/:productID', verifyToken_1.default, (0, verifyRole_1.default)(role_1.default.seller), product_1.default.updateProduct);
router.delete('/:productID', verifyToken_1.default, (0, verifyRole_1.default)(role_1.default.seller), product_1.default.deleteProduct);
module.exports = router;
//# sourceMappingURL=product.js.map