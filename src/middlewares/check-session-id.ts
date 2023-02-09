import { FastifyRequest, FastifyReply } from 'fastify';

export async function checkSessionId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { sessionId } = request.cookies;
  if (!sessionId) {
    reply.status(401).send({
      error: 'Unauthorized',
    });
  }
}
