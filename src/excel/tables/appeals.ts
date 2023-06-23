import moment from 'moment';
import DB from '../../db/index';
import Queries from '../../queries/queries';
import { initWorkbook } from '../workbook';
import { getAppealsColumns } from '../columns';

export async function getAppealsTable(year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.appeals.byMonth, [year, month + 1]);

  const tableData = res.rows.map(row => [
    row.message,
    row.phoneNumber,
    row.fullName,
    moment(row.createdAt).format('YYYY-MM-DD'),
  ]);

  const workbook = await initWorkbook(`Примітки`, getAppealsColumns());

  if (tableData.length) {
    workbook.activeSheet().cell('A2').value(tableData);
  }

  return workbook.outputAsync();
}
