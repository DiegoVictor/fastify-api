import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { execSync } from 'child_process';

import { app } from '../src/app';

describe('Transactions', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: faker.lorem.words(3),
        amount: faker.datatype.number({
          min: 1,
          max: 100,
        }),
        type: 'credit',
      })
      .expect(201);
  });

  it('should be able to list all transactions', async () => {
    const transaction = {
      title: faker.lorem.words(3),
      amount: faker.datatype.number({
        min: 1,
        max: 100,
      }),
      type: 'credit',
    };
    const creationResponse = await request(app.server)
      .post('/transactions')
      .send(transaction);
    const cookies = creationResponse.get('Set-Cookie');

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: transaction.title,
          amount: transaction.amount,
        }),
      ],
    });
  });

  it('should be able to get one transaction by id', async () => {
    const transaction = {
      title: faker.lorem.words(3),
      amount: faker.datatype.number({
        min: 1,
        max: 100,
      }),
      type: 'credit',
    };
    const creationResponse = await request(app.server)
      .post('/transactions')
      .send(transaction);
    const cookies = creationResponse.get('Set-Cookie');

    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    const {
      transactions: [{ id }],
    } = listResponse.body;

    const response = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies);

    expect(response.body).toEqual({
      transaction: expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount,
      }),
    });
  });

  it('should be able to get transactions summary', async () => {
    const [credit, debit] = Array.from({ length: 2 }, () =>
      faker.datatype.number({ min: 1, max: 100 })
    );
    const creationResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: faker.lorem.words(3),
        amount: credit,
        type: 'credit',
      });
    const cookies = creationResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: faker.lorem.words(3),
        amount: debit,
        type: 'debit',
      });

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body).toEqual({
      summary: {
        amount: credit - debit,
      },
    });
  });
});
