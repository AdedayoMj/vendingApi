

import express from 'express';
import controller from '../controller/product';
import checkJWT from '../middleware/checkJWT';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router();

router.get('/getAllProduct', controller.readAllProduct);
router.get('/read/:productID', controller.readProduct);
router.post('/addProduct', checkJWT, verifyRole(ROLES_LIST.seller) , controller.addProduct);
router.post('/query', checkJWT, verifyRole(ROLES_LIST.seller), controller.query);
router.patch('/updateProduct/:productID', checkJWT, verifyRole(ROLES_LIST.seller), controller.updateProduct);
router.delete('/:productID', checkJWT, verifyRole(ROLES_LIST.seller), controller.deleteProduct);

export = router;