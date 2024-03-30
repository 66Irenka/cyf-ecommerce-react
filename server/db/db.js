import pg from 'pg'
import config from './config.js'

/**
 * Code bellow comes from the PG documentation here:
 * https://node-postgres.com/guides/project-structure
 */

const poolConfig = {
  connectionString: config.dbUrl,
  connectionTimeoutMillis: 5000,
  ssl: config.dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
}

const pool = new pg.Pool(poolConfig)

/**
 * usage:
 * 	`import db from "path/to/db";`
 * then use it with
 * 	`await db.query("<SQL>", [...<variables>])`.
 */

const query = (queryString, params, callback) => {
  console.debug('Postgres querying: %O', { queryString, params, callback })
  return pool.query(queryString, params, callback)
}

export default { query }
