import Boom from 'boom';
import amqprpc from 'amqp-rpc';
import servicebus from 'servicebus';
import subscribers from './subscribers/subscriber';
import { login } from './helpers/user';

const rpc = amqprpc.factory();
const bus = servicebus.bus();

const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/do_something',
    config: {
      auth: false,
      handler: (req, reply) => {
        bus.publish('do.something', req.payload);
        reply({ success: true });
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
        rpc.call('user.create', data, (response) => {
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
