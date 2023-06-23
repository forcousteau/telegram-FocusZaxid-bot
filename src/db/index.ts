import { Pool } from 'pg';
import config from 'config';

const DB = {
  user: config.get<string>('db.user'),
  host: config.get<string>('db.host'),
  database: config.get<string>('db.database'),
  password: config.get<string>('db.password'),
  port: config.get<number>('db.port'),
  pool: null,
  connect: async function () {
    this.pool = new Pool({
      user: this.user,
      host: this.host,
      database: this.database,
      password: this.password,
      port: this.port,
    });
    try {
      await this.pool.connect();
      console.log(`>>> [DB] PostgreSQL connection pool was created. Host: ${this.host}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },
  getPool: function () {
    return this.pool;
  },
  transaction: async function (func) {
    const pool = this.getPool();
    try {
      await pool.query('begin');
      const res = await func(pool);
      await pool.query('commit');

      return res;
    } catch (err) {
      console.error(err);
      await pool.query('rollback');
    }
  },
};

export default DB;
