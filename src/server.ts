import fastify from 'fastify';

const app = fastify();

app
  .listen({
    port: Number(process.env.PORT || 3000),
  })
  .then(() => {
    console.log('HTTP Server Running!');
  });
