import { z } from 'zod';
import { Pipeline } from './tRPC';

const pipeline = new Pipeline()
  .input(
    z.object({
      name: z.string(),
      age: z.number(),
      job: z.object({
        title: z.string(),
        experience: z.number(),
        performance: z.number(),
      }),
    })
  )
  .ouput(
    z.object({
      match: z.boolean(),
      rate: z.number(),
    })
  )
  .query(({ input }) => {
    return {
      match: input.age < 18 && input.job.experience > 10,
      rate: 10,
    };
  });
