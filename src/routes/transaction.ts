import express from 'express'
import controller from '../controllers/transaction'
import verifyToken from '../middleware/verifyToken';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router()


router.put('/deposit/:userID', verifyToken, verifyRole(ROLES_LIST.buyer), controller.deposit)
router.put('/reset/:userID', verifyToken, verifyRole(ROLES_LIST.buyer), controller.reset)
router.post('/buyProduct/:userID', verifyToken, verifyRole(ROLES_LIST.buyer), controller.buyProduct)


export = router;
