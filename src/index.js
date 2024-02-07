import build from './server.js'
import {
  development,
  port,
  production,
  sqliteLocation,
  subscriptionEndpoint,
  subscriptionReconnectDelay
} from './config.js'
import { createDb, migrateToLatest } from './db/index.js'
import { FirehoseSubscription } from './subscription.js'

const host = development ? 'localhost' : '0.0.0.0'

const start = async () => {
  try {
    const db = createDb(sqliteLocation)
    await migrateToLatest(db)

    const fastify = await build(
      {
        disableRequestLogging: production,
        http2: production
      },
      db
    )

    await fastify.listen({ port: port, host: host })

    // const firehose = new FirehoseSubscription(db, subscriptionEndpoint)
    // firehose.run(subscriptionReconnectDelay)

    fastify.ready(() => {
      console.log(`listening on ${JSON.stringify(fastify.server.address())}`)
    })
  } catch (err) {
    console.log(err)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }
}

start()
