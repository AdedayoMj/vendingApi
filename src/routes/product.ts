
   
import express from 'express';
import controller from '../controller/product';
import checkJWT from '../middleware/checkJWT';
// import checkRole from '../middleware/checkRole';

const router = express.Router();

router.get('/', controller.readAllProduct);
router.get('/read/:productID', controller.readProduct);
router.post('/addProduct', checkJWT, controller.addProduct);
router.post('/query', checkJWT, controller.query);
router.patch('/update/:statID', checkJWT, controller.update);
router.delete('/:statID', controller.deleteStats);

export = router;