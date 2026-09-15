import { z } from 'zod';

export const createShareSchema = z.object({
  expiration: z
    .enum(['never', '1h', '1d', '7d', '30d', 'custom'])
    .default('never'),
  customHours: z.number().int().positive().max(8760).optional(), // max 1 year
});

export type CreateShareInput = z.infer<typeof createShareSchema>;
