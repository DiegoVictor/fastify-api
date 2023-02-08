import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string({
    required_error: 'Missing DATABASE_URL in environment variable',
  }),
  PORT: z
    .number({
      invalid_type_error: 'PORT must be a number',
    })
    .default(3000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      invalid_type_error:
        'NODE_ENV must one of the following: development, test or production',
      required_error: 'Missing NODE_ENV in environment variables',
    })
    .default('production'),
});

export const env = schema.parse(process.env);
