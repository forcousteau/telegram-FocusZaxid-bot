import DB from '../../db/index';
import Queries from '../../queries/queries';
import { initWorkbook } from '../workbook';
import { getLocationCheckResultsColumns } from '../columns';

export async function getLocationCheckResultTable(locationCheckId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.locationCheckResults.forTable, [locationCheckId]);

  const tableData = res.rows.map(row => [
    row.fullName,
    row.phoneNumber,
    row.identificationCode,
    row.positionName,
    row.location,
    row.working ? 'Да' : res.working === false ? 'Нет' : '-',
  ]);

  const workbook = await initWorkbook(`Проверка ${locationCheckId}`, getLocationCheckResultsColumns());

  if (tableData.length) {
    workbook.activeSheet().cell('A2').value(tableData);
  }

  return workbook.outputAsync();
}
