import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import servicebus from 'servicebus';
import User from '../models/user';
import config from '../../../config';

const bus = servicebus.bus();

bus.subscribe('user.create', (data) => {
  createUser(data);
});

export const hashPassword = (plainText) => {
  const saltRounds = 10;
  return bcrypt.hashSync(plainText, saltRounds);
};

export const createToken = (data) => {
  return jwt.sign({
    data,
  }, config.secret, { expiresIn: config.user_token_timeout });
};

export const createUser = (data) => {
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  newUser.save();
  const token = createToken(newUser);
  bus.send('user.created', token);
};

export const login = async (data) => {
  const user = await User.find().byEmail(data.email);
  if (user && bcrypt.compareSync(data.password, user.password)) {
    return createToken(user);
  }
  return { status: 403, reason: 'Authentication failed' };
};
