import express from 'express'
import controller from '../controller/user'
import checkJWT from '../middleware/checkJWT';
import checkRole from '../middleware/checkRole';

const router = express.Router()

router.get('/validate', checkJWT, controller.validateToken);
router.post('/login', controller.loginUser)
router.post('/register', controller.registerUser)
router.get('/findUser/:userID', checkJWT, controller.findUser)
router.put('/updateUser/:userID', checkJWT,checkRole('updateAny', 'updateUser'),  controller.update)
router.delete('/deleteUser/:userID', checkJWT, controller.deleteUserData)
router.get('/getAllUsers', controller.getAllUsers)

export = router;

