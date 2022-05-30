import { NextFunction, Request, Response } from 'express'
import logging from '../settings/logging'
import User from '../models/users'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs';
import signJWT from '../_helpers/signJWT';

import Joi from 'joi';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create user ...')

    let {
        name,
        role,
        deposit,
        password
    } = req.body

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
        deposit: Joi.number().min(1).max(30)
    }).keys({
        role: Joi.string().valid('buyer', 'seller'),
    });

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ name })
    if (user) return res.status(400).send('User already exist ...');
    const _user = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        password,
        deposit,
        role
    })
    const salt = await bcryptjs.genSalt(10)
    _user.password = await bcryptjs.hash(_user.password, salt)

    const userData = await _user.save()

    signJWT(userData, (_error, token) => {
        if (_error) {
            return res.status(500).json({
                message: _error.message,
                error: _error
            });
        } else if (token) {
            return res.status(201).json({
                message: 'Auth successful',
                token: token,
                user: userData
            });
        }
    });
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to login...')

    try {


        let { name, password } = req.body;

        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(3).max(30).required(),
        })

        const { error } = schema.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({ name })
        if (!user) return res.status(400).send({ message: 'Invalid  name or password...' });


        const isValid = await bcryptjs.compare(password, user.password)
        if (!isValid) return res.status(401).json({ message: 'Password Mismatch' });
        signJWT(user, (_error, token) => {
            if (_error) {
                return res.status(500).json({
                    message: _error.message,
                    error: _error
                });
            } else if (token) {
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }


        });

    } catch (error) {
        res.status(500).send({ message: error });
    }

}

const logOut = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to logout...')

    try {
        
    } catch (error) {
        res.status(500).send({ message: error });
    }


}

export default {
    registerUser,
    loginUser,
    logOut
}
