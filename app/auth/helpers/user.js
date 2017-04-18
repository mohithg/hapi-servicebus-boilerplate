import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import config from '../../../config';

export const hashPassword = (plainText) => {
  const saltRounds = 10;
  return bcrypt.hashSync(plainText, saltRounds);
};

export const createToken = (data) => {
  return jwt.sign({
    data,
  }, config.secret, { expiresIn: config.user_token_timeout });
};

export const login = async (data) => {
  const user = await User.find().byEmail(data.email);
  if (user && bcrypt.compareSync(data.password, user.password)) {
    return createToken(user);
  }
  return { status: 403, reason: 'Authentication failed' };
};
