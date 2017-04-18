import amqprpc from 'amqp-rpc';
import servicebus from 'servicebus';
import User from '../models/user';
import { hashPassword, createToken } from '../helpers/user';

const rpc = amqprpc.factory();
const bus = servicebus.bus();

bus.subscribe('do.something', (data) => {
  console.log(data); //Trigger some worker call if needed
});

const createUser = async (data) => {
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  try {
    await newUser.save();
  } catch (e) {
    return e;
  }
  const token = createToken(newUser);
  return token;
};

rpc.on('user.create', async (data, cb) => {
  const response = await createUser(data);
  cb(response);
});
