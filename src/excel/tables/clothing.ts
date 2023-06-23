import DB from '../../db/index';
import Queries from '../../queries/queries';
import { addClothingTotalSheet, addShoeTotalSheet, initWorkbook } from '../workbook';
import { getClothingColumns } from '../columns';

export async function getClothingTable() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.employees.clothing);
  const employees = res.rows;

  const tableData = employees.map(row => [row.fullName, row.clothingSize, row.shoeSize]);

  const workbook = await initWorkbook(`Одяг`, getClothingColumns());

  if (tableData.length) {
    workbook.activeSheet().cell('A2').value(tableData);
  }

  await addClothingTotalSheet(workbook, employees);
  await addShoeTotalSheet(workbook, employees);

  return workbook.outputAsync();
}
