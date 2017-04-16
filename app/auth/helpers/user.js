import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import config from '../../../config';

export const hashPassword = (plainText) => {
  const saltRounds = 10;
  return bcrypt.hashSync(plainText, saltRounds);
};

export const createUser = (data) => {
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  newUser.save();
  return jwt.sign({
    data: newUser,
  }, config.secret, { expiresIn: config.user_token_timeout });
};
