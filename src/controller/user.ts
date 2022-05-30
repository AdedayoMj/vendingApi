import { NextFunction, Request, Response } from 'express'
import logging from '../settings/logging'
import User from '../models/users'

import Joi from 'joi';





/** find a single user*/
const findUser = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name
  logging.info(`Incoming read for user data with username ${name}`)
  try {
    
    let userData = await User.findOne({ name }).exec()
    if (!userData) return res.status(400).send({ message: 'User not found...' });
    return res.status(200).json({ user:userData });
  } catch (error) {
    logging.error(error)
    return res.status(500).json(error)
  }

}



/** update user's infomation */
const update = async (req: Request, res: Response, next: NextFunction) => {
  logging.info('Update route called')

  const _id = req.params.userID

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    deposit: Joi.number().min(1).max(30)
  }).keys({
    role: Joi.string().valid('buyer', 'seller'),
  });
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {

    let response = await User.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
    if (!response) return res.status(400).send({ message: 'User information not updated!' });
    return res.status(201).json({ message: 'User data have been modified!' })

  } catch (error) {
    logging.error(error)

    return res.status(500).json({
      message: error
    })
  }

}

/** get all single users*/
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  logging.info('Returning all Users data information ')
  try {
    let users = await User.find().exec()
    if (!users) return res.status(400).send({ message: 'User list does not exist...' });
    return res.status(200).json({ user:users });
  } catch (error) {
    logging.error(error)
    return res.status(500).json(error)
  }
}

/** delete a single user*/

const deleteUserData = async (req: Request, res: Response, next: NextFunction) => {
  logging.warn('Delete route called')

  const _id = req.params.userID
  try {
    await User.findByIdAndDelete(_id).exec()
    return res.status(201).json({ message: 'User data deleted' })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export default {
  findUser,
  update,
  getAllUsers,
  deleteUserData
}