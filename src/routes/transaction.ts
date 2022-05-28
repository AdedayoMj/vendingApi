import express from 'express'
import controller from '../controller/transaction'
import checkJWT from '../middleware/checkJWT';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router()


router.put('/deposit/:userID', checkJWT, verifyRole(ROLES_LIST.buyer), controller.deposit)
router.put('/reset/:userID', checkJWT, verifyRole(ROLES_LIST.buyer), controller.reset)
router.post('/buyProduct/:userID', checkJWT, verifyRole(ROLES_LIST.buyer), controller.buyProduct)


export = router;
