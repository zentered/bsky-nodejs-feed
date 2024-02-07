import { hostname, serviceDid } from './config.js'

export default async function (app) {
  app.get('/.well-known/did.json', (request, reply) => {
    if (!serviceDid.endsWith(hostname)) {
      return reply.statusCode(404).send()
    }
    return reply.send({
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: serviceDid,
      service: [
        {
          id: '#bsky_fg',
          type: 'BskyFeedGenerator',
          serviceEndpoint: `https://${hostname}`
        }
      ]
    })
  })
}
