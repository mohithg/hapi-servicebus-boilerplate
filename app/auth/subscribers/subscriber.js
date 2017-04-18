import servicebus from 'servicebus';
import amqprpc from 'amqp-rpc';
import User from '../models/user';
import { hashPassword, createToken } from '../helpers/user';

const rpc = amqprpc.factory();
const bus = servicebus.bus();

const createUser = async (data) => {
  data.password = hashPassword(data.password);
  const newUser = new User(data);
  try {
    await newUser.save();
  } catch (e) {
    rpc.call('user.created', e, ()=>{});
    return;
  }
  const token = createToken(newUser);
  rpc.call('user.created', { token }, ()=>{});
};

rpc.on('user.create', (data) => {
  createUser(data);
});
