import express from 'express'
import controller from '../controller/user'
import checkJWT from '../middleware/checkJWT';
import verifyRole from '../middleware/verifyRole';
import ROLES_LIST from '../_helpers/role'


const router = express.Router()

router.get('/validate', checkJWT, controller.validateToken);
router.post('/login', controller.loginUser)
router.post('/register', controller.registerUser)
router.get('/findUser/:userID', checkJWT, controller.findUser)
router.put('/updateUser/:userID',checkJWT, verifyRole(ROLES_LIST.buyer, ROLES_LIST.seller), controller.update)
router.delete('/deleteUser/:userID', checkJWT, controller.deleteUserData)
router.get('/getAllUsers', controller.getAllUsers)

export = router;

