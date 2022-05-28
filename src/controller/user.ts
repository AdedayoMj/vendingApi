import { NextFunction, Request, Response } from 'express'
import logging from '../config/logging'
import User from '../models/users'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs';
import signJWT from '../_helpers/signJWT';
import { request } from 'http';


// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');



// async function hashPassword(password) {
//   return await bcrypt.hash(password, 10);
// }

// async function validatePassword(plainPassword, hashedPassword) {
//   return await bcrypt.compare(plainPassword, hashedPassword);
// }


const NAMESPACE = 'Users';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Token validated, user authorized.');

  return res.status(200).json({
    message: 'Token(s) validated'
  });
}




const registerUser = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to create user ...')


  let {
    name,
    role,
    deposit,
    password
  } = req.body

  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(401).json({
        message: hashError.message,
        error: hashError
      });
    }



    const _user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      password: hash,
      deposit,
      role
    })

    return _user
      .save()
      .then((newUser) => {
        logging.info('New user  data created')

        return res.status(201).json({ user: newUser })
      })
      .catch((error) => {
        logging.error(error.message)

        return res.status(500).json({
          message: error.message
        })
      })
  })
}

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to login...')
  let { name, password } = req.body;


  User.find({ name })
    .exec()
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      bcryptjs.compare(password, users[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: 'Password Mismatch'
          });
        } else if (result) {
          signJWT(users[0], (_error, token) => {
            if (_error) {
              return res.status(500).json({
                message: _error.message,
                error: _error
              });
            } else if (token) {
              return res.status(200).json({
                message: 'Auth successful',
                token: token,
                user: users[0]
              });
            }
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

}


/** find a single user*/
const findUser = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.userID
  logging.info(`Incoming read for user data with id ${_id}`)

  User.findById(_id)
    .select('-password')
    .populate('name')
    .exec()
    .then((user) => {
      if (user) {
        return res.status(200).json({ user })
      } else {
        return res.status(404).json({
          error: 'Information not found.'
        })
      }
    })
    .catch((error) => {
      logging.error(error.message)

      return res.status(500).json({
        error: error.message
      })
    })
}

/** update user's infomation */
const update = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Update route called')

  const _id = req.params.userID

  User.findByIdAndUpdate(_id, { $set: req.body }, { new: true }).then((response) => {

    if (response) {

      return res.status(201).json({
        message: 'User information updated',

      })

    } else {
      logging.error(`Something went wrong while updating`)
      return res.status(401).json({
        message: 'NOT UPDATED'
      })
    }

  }).catch((error) => {
    logging.error(error.message)

    return res.status(500).json({
      message: error.message
    })
  })
}

/** get all single users*/
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Returning all Users data information ')

  User.find()
    .select('-password')
    .populate('name')
    .exec()
    .then((user) => {
      return res.status(200).json({
        count: user.length,
        user: user
      })
    })
    .catch((error) => {
      logging.error(error.message)

      return res.status(500).json({
        message: error.message
      })
    })
}

/** delete a single user*/

const deleteUserData = (req: Request, res: Response, next: NextFunction) => {
  logging.warn('Delete route called')

  const _id = req.params.userID

  User.findByIdAndDelete(_id)
    .exec()
    .then(() => {
      return res.status(201).json({
        message: 'User data deleted'
      })
    })
    .catch((error) => {
      logging.error(error.message)

      return res.status(500).json({
        message: error.message
      })
    })
}

export default {
  validateToken,
  registerUser,
  loginUser,
  findUser,
  update,
  getAllUsers,
  deleteUserData
}