import User from '../models/user';

export const createUser = (data) => {
  const newUser = new User(data);
  newUser.save();
};
