import { config } from 'dotenv'
import { Redis } from 'ioredis'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env.config'
import { PrismaClient } from '@prisma/client'

config({ override: true, path: '.env' })
config({ override: true, path: '.env.test' })

const env = envSchema.parse(process.env)

const redis = new Redis({
  db: env.REDIS_DB,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
})

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable.')
  }

  const url = new URL(env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  DomainEvents.shouldRun = false
  await redis.flushdb()
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  execSync('yarn prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
