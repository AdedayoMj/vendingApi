import express from 'express'
import controller from '../controller/auth'
import verifyToken from '../middleware/verifyToken';


const router = express.Router()

router.post('/login', controller.loginUser)
router.post('/register', controller.registerUser)
router.post('/logout', verifyToken, controller.logOut)

export = router;

