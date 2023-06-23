import DB from '../db/index';
import Queries from '../queries/queries';

export async function addContractor(fullName: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.contractor, [fullName]);
}

export async function getContractors() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.contractors.all);
  return res.rows;
}

export async function getContractorById(id) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.contractors.byId, [id]);
  return res.rows[0];
}

export async function updateContractor(
  id: number,
  data: {
    fullName?: string;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'contractors',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}

export async function deleteContractors(ids: number[]) {
  const pool = DB.getPool();
  await pool.query(Queries.delete.contractors.byIds, [ids]);
}
