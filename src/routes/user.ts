// import express from 'express'
// import controller from '../controllers/user'
// import verifyToken from '../middleware/verifyToken';
// import verifyRole from '../middleware/verifyRole';
// import ROLES_LIST from '../_helpers/role'


// const router = express.Router()

// router.get('/findUser', verifyToken, controller.findUser)
// router.put('/updateUser/:userID', verifyToken, verifyRole(ROLES_LIST.buyer, ROLES_LIST.seller), controller.update)
// router.delete('/deleteUser/:userID', verifyToken, controller.deleteUserData)
// router.get('/getAllUsers', controller.getAllUsers)

// export = router;

import express from 'express';
import {
  getAllUsersHandler,
  getMeHandler,
} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';

const router = express.Router();
router.use(deserializeUser, requireUser);

// Admin Get Users route
router.get('/getAllUsers' , getAllUsersHandler);

// Admin Get Users route
router.get('/getAllUsers' , getAllUsersHandler);

// Get my info route
router.get('/me', getMeHandler);

export default router;

