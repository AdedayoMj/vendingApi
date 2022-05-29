

import express from 'express';
import controller from '../controller/product';
import checkJWT from '../middleware/checkJWT';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router();

router.get('/getAllProduct', controller.getAllProduct);
router.get('/findProduct/:productID', controller.findProduct);
router.post('/addProduct', checkJWT, controller.upload.single('productImage'), verifyRole(ROLES_LIST.seller) , controller.addProduct);
router.put('/updateProduct/:productID', checkJWT, verifyRole(ROLES_LIST.seller), controller.updateProduct);
router.delete('/:productID', checkJWT, verifyRole(ROLES_LIST.seller), controller.deleteProduct);

export = router;