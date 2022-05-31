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
  modifyUserDeposit,
  deleteMeHandler,
  updateMeHandler
} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';
import { validate } from '../middleware/validate';
import { updateMeSchema } from '../schemas/user.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get Users route
router.get('/getAllUsers', getAllUsersHandler);

// Update deposit route
router.patch('/deposit', restrictTo('buyer'), modifyUserDeposit)

// Update other user information
router.patch('/updateUser', validate(updateMeSchema), updateMeHandler);

// Get my info route
router.get('/me', getMeHandler);

// delete Users route
router.delete('/deleteUser', deleteMeHandler);


export default router;

