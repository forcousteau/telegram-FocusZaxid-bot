import DB from '../db/index';
import Queries from '../queries/queries';

export async function getClothingSizes() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.clothingSizes.all);
  return res.rows;
}

export async function getClothingSizeById(id: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.clothingSizes.byId, [id]);
  return res.rows[0];
}
