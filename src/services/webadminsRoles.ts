import DB from '../db';
import Queries from '../queries/queries';

export async function getWebadminsRoles() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.webadminsRoles.all);
  return res.rows;
}

export async function getWebadminRoleByUsername(username: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.webadminsRoles.byUsername, [username]);
  return res.rows[0];
}
