import Boom from 'boom';
import servicebus from 'servicebus';
import { createUser, login } from './helpers/user';

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
        bus.publish('user.create', data);
        bus.listen('user.created', (token) => {
          reply({ token });
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
