import express from 'express'
import controller from '../controller/auth'



const router = express.Router()

router.post('/login', controller.loginUser)
router.post('/register', controller.registerUser)

export = router;

