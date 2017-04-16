import Boom from 'boom';
import { createUser, login } from './helpers/user';

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
        const user = createUser(data);
        reply({ token: user });
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
