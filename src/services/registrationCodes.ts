import DB from '../db/index';
import Queries from '../queries/queries';

export async function addRegistrationCode(code: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.registrationCode, [code]);
}

export async function addRegistrationCodes(codes: string[]) {
  const pool = DB.getPool();
  const query = Queries.build.insertWithMultipleValues({
    tableName: 'registrationCodes',
    columns: ['code'],
    valuesAmount: codes.length,
  });
  const res = await pool.query(query, codes);
}

export async function getRegistrationCodes() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.registrationCodes.all);
  return res.rows;
}

export async function checkRegistrationCode(code: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.registrationCodes.byCode, [code]);
  return res.rowCount ? true : false;
}

export async function deleteRegistrationCode(code: string) {
  const pool = DB.getPool();
  await pool.query(Queries.delete.registrationCodes.byCode, [code]);
}

export async function deleteRegistrationCodes(codes: string[]) {
  const pool = DB.getPool();
  await pool.query(Queries.delete.registrationCodes.byCodes, [codes]);
}
