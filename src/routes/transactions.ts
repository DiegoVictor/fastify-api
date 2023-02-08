import { randomUUID } from 'crypto';
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

  app.post('/', async (request, reply) => {
    const validator = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });
    const { amount, title, type } = validator.parse(request.body);

    await knex('transactions').insert({
      id: randomUUID(),
      amount: type === 'credit' ? amount : amount * -1,
      title,
    });

    return reply.status(201).send();
  });
}
