import Boom from 'boom';
import { createUser } from './helpers/user';

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

  next();
};

register.attributes = {
  name: 'auth',
};

export default register;
