import DB from '../db/index';
import Queries from '../queries/queries';

export async function addRegion(data: { name: string; price: number }) {
  const { name, price } = data;
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.region, [name, price]);
}

export async function getRegions() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.regions.all);
  return res.rows;
}

export async function getActiveRegions() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.regions.byActive);
  return res.rows;
}

export async function updateRegion(
  id: number,
  data: {
    name?: string;
    price?: number;
    isActive?: boolean;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'regions',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}
