import { knex as setup, Knex } from 'knex';
import { env } from './env';

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = setup(config);
