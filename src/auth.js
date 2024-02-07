import { verifyJwt, AuthRequiredError } from '@atproto/xrpc-server'

export const validateAuth = async (req, serviceDid, didResolver) => {
  const { authorization = '' } = req.headers
  if (!authorization.startsWith('Bearer ')) {
    throw new AuthRequiredError()
  }
  const jwt = authorization.replace('Bearer ', '').trim()
  return verifyJwt(jwt, serviceDid, async (did) => {
    return didResolver.resolveAtprotoKey(did)
  })
}
