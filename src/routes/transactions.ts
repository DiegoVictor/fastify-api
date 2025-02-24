import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';
import { checkSessionId } from '../middlewares/check-session-id';

export async function routes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionId] }, async request => {
    const { sessionId } = request.cookies;
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select();

    return { transactions };
  });

  app.get('/:id', { preHandler: [checkSessionId] }, async request => {
    const { sessionId } = request.cookies;
    const validator = z.object({
      id: z.string().uuid(),
    });
    const { id } = validator.parse(request.params);

    const transaction = await knex('transactions')
      .where({ id, session_id: sessionId })
      .first();

    return { transaction };
  });

  app.get('/summary', { preHandler: [checkSessionId] }, async request => {
    const { sessionId } = request.cookies;
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', {
        as: 'amount',
      })
      .first();

    return { summary };
  });

  app.post('/', async (request, reply) => {
    const validator = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });
    const { success, data, error } = validator.safeParse(request.body);

    if (!success) {
      return reply.status(400).send(error.issues);
    }

    const sessionId = request.cookies.sessionId ?? randomUUID();
    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    await knex('transactions').insert({
      id: randomUUID(),
      amount: data.type === 'credit' ? data.amount : data.amount * -1,
      title: data.title,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
