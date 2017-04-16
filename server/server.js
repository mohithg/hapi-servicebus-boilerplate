import Hapi from 'hapi';
import auth from '../app/auth/auth';
import db from './db';

const server = new Hapi.Server();

server.connection({
  port: 8080,
  host: 'localhost',
});

const handler = (req, res) => {
  res({ "hello": 'world' });
};

server.register(auth, (err) => {
  if (err) {
    console.error('Error in register');
    console.log(err);
  }
});

server.route({
  method: 'GET',
  path: '/hello',
  handler,
});

server.start((err) => {
  if (err) {
    console.error('Error was handled!');
    console.error(err);
  }
  console.log(`Server started at ${server.info.uri}`);
  db.on('connected', () => {
    console.log('DB started');
  });
});
