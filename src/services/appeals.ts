import DB from '../db/index';
import Queries from '../queries/queries';

export async function addAppeal(data: { message: string; employeeId: number }) {
  const { message, employeeId } = data;
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.appeal, [message, employeeId]);
}

export async function getAppeals() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.appeals.all);
  return res.rows;
}

export async function deleteAppeals(ids: number[]) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.delete.appeals.byIds, [ids]);
}
