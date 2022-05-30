// import express from 'express'
// import controller from '../controllers/auth'
// import verifyToken from '../middleware/verifyToken';


// const router = express.Router()

// router.post('/login', controller.loginUser)
// router.post('/register', controller.registerUser)
// router.post('/logout', verifyToken, controller.logOut)

// export = router;


import express from 'express';
import { loginHandler, registerHandler } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

export default router;