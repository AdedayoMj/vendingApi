
import express from 'express';
import {
  getAllUsersHandler,
  getMeHandler,
  modifyUserDeposit,
  resetDeposit,
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


// Update deposit route
router.patch('/reset', restrictTo('buyer'), resetDeposit)

// Update other user information
router.patch('/updateUser', validate(updateMeSchema), updateMeHandler);

// Get my info route
router.get('/me', getMeHandler);

// delete Users route
router.delete('/deleteUser', deleteMeHandler);


export default router;

