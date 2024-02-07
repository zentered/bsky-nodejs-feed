import SqliteDb from 'better-sqlite3'
import { Kysely, Migrator, SqliteDialect } from 'kysely'
import { migrationProvider } from './migrations.js'
export const createDb = (location) => {
  return new Kysely({
    dialect: new SqliteDialect({
      database: new SqliteDb(location)
    })
  })
}
export const migrateToLatest = async (db) => {
  const migrator = new Migrator({ db, provider: migrationProvider })
  const { error } = await migrator.migrateToLatest()
  if (error) throw error
}
