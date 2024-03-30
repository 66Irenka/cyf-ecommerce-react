import pg from "pg";
import config from "./config.js";

const poolConfig = {
  connectionString: config.dbUrl,
  connectionTimeoutMillis: 5000,
  ssl: config.dbUrl.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
};

const pool = new pg.Pool(poolConfig);

export const connectDb = async () => {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.error("%O", err);
    process.exit(1);
  }
  console.info("Postgres connected to %s", client.database);
  client.release();
};

export const disconnectDb = () => pool.end();

export default {
  query: (...args) => {
    console.debug("Postgres querying", args);
    return pool.query.apply(pool, args);
  },
};
