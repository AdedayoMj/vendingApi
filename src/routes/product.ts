

import express from 'express';
import controller from '../controller/product';
import verifyToken from '../middleware/verifyToken';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router();

router.get('/getAllProducts', controller.getAllProduct);
router.get('/findProduct/:productID', controller.findProduct);
router.post('/addProduct', verifyToken, controller.upload.single('productImage'), verifyRole(ROLES_LIST.seller) , controller.addProduct);
router.put('/updateProduct/:productID', verifyToken, verifyRole(ROLES_LIST.seller), controller.updateProduct);
router.delete('/:productID', verifyToken, verifyRole(ROLES_LIST.seller), controller.deleteProduct);

export = router;