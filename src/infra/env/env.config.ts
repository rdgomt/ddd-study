import { z } from 'zod'

const DEFAULT_PORT = 3333

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(DEFAULT_PORT),
})

export type Env = z.infer<typeof envSchema>
