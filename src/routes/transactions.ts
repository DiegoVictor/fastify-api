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
    const { amount, title, type } = validator.parse(request.body);

    const sessionId = request.cookies.sessionId ?? randomUUID();
    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    await knex('transactions').insert({
      id: randomUUID(),
      amount: type === 'credit' ? amount : amount * -1,
      title,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
