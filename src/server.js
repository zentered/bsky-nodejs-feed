import Fastify from 'fastify'
import corsPlugin from '@fastify/cors'
import compression from '@fastify/compress'
import helmet from '@fastify/helmet'
import { DidResolver, MemoryCache } from '@atproto/identity'
import { createServer } from './lexicon/index.js'
import feedGeneration from './methods/feed-generation.js'
import describeGenerator from './methods/describe-generator.js'
import wellKnown from './well-known.js'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'

async function build(opts = {}, db) {
  const fastify = Fastify(opts)
  fastify.register(helmet, { contentSecurityPolicy: false })
  fastify.register(corsPlugin)
  fastify.register(compression)

  const didCache = new MemoryCache()
  const didResolver = new DidResolver({
    plcUrl: 'https://plc.directory',
    didCache
  })

  const server = createServer({
    validateResponse: true,
    payload: {
      jsonLimit: 100 * 1024, // 100kb
      textLimit: 100 * 1024, // 100kb
      blobLimit: 5 * 1024 * 1024 // 5mb
    }
  })
  console.log(server)
  const ctx = {
    db,
    didResolver
  }
  // fastify.register(feedGeneration(server))
  // fastify.register(describeGenerator(server))
  fastify.register(fastifyTRPCPlugin, {
    prefix: '/xrpc',
    trpcOptions: {
      router: createServer(ctx),
      ctx,
      onError({ path, error }) {
        console.error(`Error in tRPC handler on path '${path}':`, error)
      }
    }
  })
  fastify.register(wellKnown)

  return fastify
}

export default build
