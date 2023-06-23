import argon2 from 'argon2';
import DB from '../db';
import Queries from '../queries/queries';

export async function addWebadmin(username: string, password: string, roleId: number) {
  const pool = DB.getPool();
  const hashedPassword = await argon2.hash(password);
  await pool.query(Queries.insert.webadmin, [username, hashedPassword, roleId]);
}

export async function getWebadminsForAdminPanel() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.webadmins.forAdminPanel);
  return res.rows;
}

export async function getWebadmin(username: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.webadmins.byUsername, [username]);
  return res.rows[0];
}

export async function updateWebadmin(
  id: number,
  data: {
    username?: string;
    password?: string;
    roleId?: number;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'webadmins',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}

export async function deleteWebadmins(ids: number[]) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.delete.webadmins.byIds, [ids]);
}

export async function checkPassword(username: string, password: string): Promise<boolean> {
  const webadmin = await getWebadmin(username);
  return webadmin ? argon2.verify(webadmin.password, password) : false;
}

export async function updatePassword(id: number, password: string) {
  const data = {
    password: await argon2.hash(password),
  };

  await updateWebadmin(id, data);
}
