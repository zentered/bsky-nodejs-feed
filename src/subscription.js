import { isCommit } from './lexicon/types/com/atproto/sync/subscribeRepos.js'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription.js'

const tags = ['#nodejs', '#javascript', 'node.js', 'nodejs']

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        return tags.some((tag) =>
          create.record.text.toLowerCase().includes(tag)
        )
      })
      .map((create) => {
        console.log(create)
        return {
          uri: create.uri,
          cid: create.cid,
          replyParent: create.record?.reply?.parent.uri ?? null,
          replyRoot: create.record?.reply?.root.uri ?? null,
          indexedAt: new Date().toISOString()
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
