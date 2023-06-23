import DB from '../db/index';
import Queries from '../queries/queries';

export async function addPositionCategory(name: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.positionCategory, [name]);
}

export async function getPositionCategories() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.positionCategories.all);
  return res.rows;
}

export async function updatePositionCategory(
  id: number,
  data: {
    name?: string;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'positionCategories',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}
