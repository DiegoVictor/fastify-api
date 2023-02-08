import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function routes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select();
    return { transactions };
  });

  app.get('/:id', async request => {
    const validator = z.object({
      id: z.string().uuid(),
    });
    const { id } = validator.parse(request.params);

    const transaction = await knex('transactions').where({ id }).first();

    return { transaction };
  });

}
