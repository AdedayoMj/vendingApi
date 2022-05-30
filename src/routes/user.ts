import express from 'express'
import controller from '../controller/user'
import verifyToken from '../middleware/verifyToken';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router()

router.get('/findUser', verifyToken, controller.findUser)
router.put('/updateUser/:userID', verifyToken, verifyRole(ROLES_LIST.buyer, ROLES_LIST.seller), controller.update)
router.delete('/deleteUser/:userID', verifyToken, controller.deleteUserData)
router.get('/getAllUsers', controller.getAllUsers)

export = router;

