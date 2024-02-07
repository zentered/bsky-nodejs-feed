const maybeStr = (val) => {
  if (!val) return undefined
  return val
}

const maybeInt = (val) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

export const hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'example.com'
export const production = process.env.NODE_ENV === 'production'
export const development = process.env.NODE_ENV !== 'production'
export const serviceDid =
  maybeStr(process.env.FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`
export const port = maybeInt(process.env.FEEDGEN_PORT) ?? 3000
export const sqliteLocation =
  maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? ':memory:'
export const subscriptionEndpoint =
  maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ?? 'wss://bsky.network'
export const publisherDid =
  maybeStr(process.env.FEEDGEN_PUBLISHER_DID) ?? 'did:example:alice'
export const subscriptionReconnectDelay =
  maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000

export const handle = process.env.BSKY_HANDLE
// YOUR bluesky password, or preferably an App Password (found in your client settings)
// Ex: abcd-1234-efgh-5678
export const password = process.env.BSKY_PASSWORD
// A short name for the record that will show in urls
// Lowercase with no spaces.
// Ex: whats-hot
export const recordName = process.env.BSKY_RECORD_NAME
// A display name for your feed
// Ex: What's Hot
export const displayName = process.env.BSKY_DISPLAY_NAME
// (Optional) A description of your feed
// Ex: Top trending content from the whole network
export const description = process.env.BSKY_DESCRIPTION
// (Optional) The path to an image to be used as your feed's avatar
// Ex: ~/path/to/avatar.jpeg
export const avatar = process.env.BSKY_AVATAR
