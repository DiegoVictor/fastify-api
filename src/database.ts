import { knex as setup, Knex } from 'knex';

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: `./db/fastify-api.sqlite`,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = setup(config);
