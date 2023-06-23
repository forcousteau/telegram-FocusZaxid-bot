import { Pool } from 'pg';
import DB from '../db';
import Queries from '../queries/queries';

export async function addWorkingHoursChange(data: {
  date: Date;
  workingHoursBefore: number;
  workingHoursAfter: number;
  employeeId: number;
  objectId: number;
}, params?: { pool: Pool }) {
  const pool = params?.pool || DB.getPool();

  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.insert({
    tableName: 'workingHoursChanges',
    columns,
  });
  const res = await pool.query(query, values);
  return res.rows[0];
}

export async function getWorkingHoursChangesForAdminPanel() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workingHoursChanges.forAdminPanel);
  return res.rows;
}

export async function getWorkingHoursChangesByMonth(year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workingHoursChanges.byMonth, [year, month + 1]);
  return res.rows;
}

export async function getWorkingHoursChangesByChatIdAndMonth(chatId: number, year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workingHoursChanges.byChatIdAndMonth, [chatId, year, month + 1]);
  return res.rows;
}
