import DB from '../db/index';
import Queries from '../queries/queries';

export async function addVar(data: { name: string; value: string }) {
  const { name, value } = data;
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.var, [name, value]);
}

export async function getVars() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.vars.all);
  return res.rows;
}

export async function getVarByName(name: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.vars.byName, [name]);
  return res.rows[0];
}

export async function updateVar(
  id: number,
  data: {
    name?: string;
    value?: string;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'vars',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}

export async function updateVarByName(
  data: {
    name: string;
    value?: string;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues({value: data.value});
  const query = Queries.build.update({
    tableName: 'vars',
    columns,
    where: `name = '${data.name}'`,
  });
  await pool.query(query, values);
}
