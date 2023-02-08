import fastify from 'fastify';
import { env } from './env';
import { routes as transactions } from './routes/transactions';

const app = fastify();

app.register(transactions, {
  prefix: 'transactions',
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!');
  });
