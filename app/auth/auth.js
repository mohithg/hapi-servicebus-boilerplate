import Boom from 'boom';
import servicebus from 'servicebus';
import amqprpc from 'amqp-rpc';
import subscribers from './subscribers/subscriber';
import { login } from './helpers/user';

const rpc = amqprpc.factory();
const bus = servicebus.bus();

const register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/auth',
    config: {
      auth: false,
      handler: (req, reply) => {
        reply({ hai: 'World' });
      },
    },
  });
  server.route({
    method: 'POST',
    path: '/register',
    config: {
      auth: false,
      handler: (req, reply) => {
        const data = req.payload;
        rpc.call('user.create', data);
        rpc.on('user.created', (response) => {
          console.log(response);
          reply(response);
        });
      },
    },
  });
  server.route({
    method: 'POST',
    path: '/login',
    config: {
      auth: false,
      handler: async (req, reply) => {
        const data = req.payload;
        const user = await login(data);
        reply({ token: user });
      },
    },
  });

  next();
};

register.attributes = {
  name: 'auth',
};

export default register;
