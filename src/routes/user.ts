import express from 'express'
import controller from '../controller/user'
import checkJWT from '../middleware/checkJWT';

const router = express.Router()

router.get('/validate', checkJWT, controller.validateToken);
router.post('/login', controller.loginUser)
router.post('/register', controller.registerUser)
router.get('/findUser/:userID', checkJWT, controller.findUser)
router.patch('/updateUser/:userID', checkJWT, controller.update)
router.delete('/deleteUser/:userID', checkJWT, controller.deleteUserData)
router.get('/getAllUsers', controller.getAllUsers)

export = router;