import { AtpAgent } from '@atproto/api'
import fs from 'fs/promises'
import { ids } from '../src/lexicon/lexicons.js'
import {
  handle,
  password,
  recordName,
  displayName,
  description,
  avatar,
  hostname,
  serviceDid
} from '../src/config.js'

const run = async () => {
  if (!serviceDid && !hostname) {
    throw new Error('Please provide a hostname in the .env file')
  }
  const feedGenDid = serviceDid ?? `did:web:${hostname}`
  // only update this if in a test environment
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })
  let avatarRef
  if (avatar) {
    let encoding
    if (avatar.endsWith('png')) {
      encoding = 'image/png'
    } else if (avatar.endsWith('jpg') || avatar.endsWith('jpeg')) {
      encoding = 'image/jpeg'
    } else {
      throw new Error('expected png or jpeg')
    }
    const img = await fs.readFile(avatar)
    const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
      encoding
    })
    avatarRef = blobRes.data.blob
  }
  await agent.api.com.atproto.repo.putRecord({
    repo: agent.session?.did ?? '',
    collection: ids.AppBskyFeedGenerator,
    rkey: recordName,
    record: {
      did: feedGenDid,
      displayName: displayName,
      description: description,
      avatar: avatarRef,
      createdAt: new Date().toISOString()
    }
  })
  console.log('All done 🎉')
}
run()
