import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';
import { checkArray } from '../middleware/checkArray';
import { User } from '../models/user.model';
import { UpdateMeInput } from '../schemas/user.schema';
import { findAllUsers, findAndUpdateUser } from '../services/user.service';
import AppError from '../utils/appError';
import logging from '../utils/logging'
import { excludedFields } from './auth.controller';




interface CustomeRequest<T> extends Request<{}, {}, UpdateMeInput> {
  body: T;
}

type filterFields = {
  username: string,
  role: string,
  deposit: string,
}

function filterObj(obj: CustomeRequest<User>, ...allowedFields: string[]) {
  const newObj = {} as filterFields;
  Object.keys(obj).forEach((el: string) => {
    //@ts-ignore
    newObj[el] = obj[el]
  })
  return newObj
}


export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = res.locals.user;
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info('Requesting all Users data information ')
  try {
    const users = await findAllUsers();
    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const modifyUserDeposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info(`Deposit route called`)

  try {
    let checkAmountToDepositEnabled = await checkArray(req.body.deposit)
    if (!req.body.deposit || !checkAmountToDepositEnabled) {
      return next(
        new AppError('Please supply the corrct currency', 204)
      )
    }


    let filter = filterObj(req.body, 'deposit')
    const update = { deposit: filter.deposit + res.locals.user.deposit }

    const user = await findAndUpdateUser({ _id: res.locals.user._id }, update, {
      new: true,
      runValidators: true
    })

    if (!user) {
      return next(new AppError('User no longer exist, 404'))
    }

    const newUser = omit(user.toJSON(), excludedFields)

    res.status(200).json({
      status: 'success',
      data: {
        user: newUser
      }
    });


  } catch (err: any) {
    logging.error(err)
    next(err);
  }
};

export const updateMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user POSTed password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password update, please use /updatePassword',
          403
        )
      );
    }

    const filter = filterObj(req.body, 'username', 'role');

    const user = await findAndUpdateUser({ _id: res.locals.user._id }, filter, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError('User no logger exist', 404));
    }

    const newUser = omit(user.toJSON(), excludedFields);

    res.status(200).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err: any) {
    next(err);
  }
};


export const deleteMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findAndUpdateUser(
      { _id: res.locals.user._id },
      { active: false },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!user) {
      return next(new AppError('User does not exist', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
