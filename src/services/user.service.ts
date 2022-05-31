import { omit, get } from 'lodash';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import config from 'config';
import userModel, { User } from '../models/user.model';
import { excludedFields } from '../controllers/auth.controller';
import { signJwt, verifyJwt } from '../utils/jwt';
import redisClient from '../utils/connectRadis';
import { DocumentType, queryMethod } from '@typegoose/typegoose';

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Deposite money for uer 
export const findAndUpdateUser = async (query: FilterQuery<User>, update: UpdateQuery<number>, options: QueryOptions) => {

  return await userModel.findOneAndUpdate(query, update, options)

};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};


// Find All users
export const deleteUser = async (query: FilterQuery<User>) => {
  return await userModel.findOneAndDelete(queryMethod);
};


// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const access_token = await signJwt(
    { sub: user._id },
    {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    }
  );



  // Create a Session
  redisClient.set((user._id).toString(), JSON.stringify(user), {
    EX: 60 * 60,
  });



  // Return access token
  return { access_token };
};
