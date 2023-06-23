import DB from '../db/index';
import Queries from '../queries/queries';

export async function getAdditionalPaymentsByEmployeeAndMonth(chatId: number, year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.additionalPayments.forTableByEmployee, [chatId, year, month + 1]);
  return res.rows;
}

export async function getAdditionalPaymentsByMonth(year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.additionalPayments.byMonth, [year, month + 1]);
  return res.rows;
}

export async function updateAdditionalPayment({ employeeId, year, month, type, sum }) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.upsert.additionalPayments, [employeeId, type, year, month + 1, sum]);
  return res.rows;
}
