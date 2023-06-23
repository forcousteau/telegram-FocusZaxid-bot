import DB from '../db/index';
import Queries from '../queries/queries';

export async function addPosition(data: { positionCategoryId: number; name: string; price: number }) {
  const { positionCategoryId, name, price } = data;
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.position, [positionCategoryId, name, price]);
}

export async function getPositionsForAdminPanel() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.positions.forAdminPanel);
  return res.rows;
}

export async function getPositionById(id: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.positions.byId, [id]);
  return res.rows[0];
}

export async function updatePosition(
  id: number,
  data: {
    positionCategoryId?: number;
    name?: string;
    price?: number;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'positions',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}
