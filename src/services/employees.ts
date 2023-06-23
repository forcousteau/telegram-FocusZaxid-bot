import _ from 'lodash';
import DB from '../db/index';
import Queries from '../queries/queries';

export async function getEmployeesForAdminPanel() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.employees.forAdminPanel);
  return res.rows;
}

export async function getEmployeeByChatId(chatId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.employees.byChatId, [chatId]);
  return res.rows[0];
}

export async function getEmployeesByBirthday(day: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.employees.byBirthday, [day, month + 1]);
  return res.rows;
}

export async function getEmployees() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.employees.all);
  return res.rows;
}

export async function addEmployee(data: {
  chatId: number;
  fullName: string;
  birthDate: any;
  phoneNumber: string;
  positionId?: number;
  identificationCode: number;
  shoeSize: number;
  clothingSizeId: number;
}) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.insert({
    tableName: 'employees',
    columns,
  });
  await pool.query(query, values);
}

export async function updateEmployee(
  id: number,
  data: {
    fullName?: string;
    birthDate?: Date;
    phoneNumber?: string;
    positionId?: number;
    identificationCode?: string;
    shoeSize?: string;
    clothingSizeId?: number;
    organisationId?: number;
    photoName?: string;
    isFired?: boolean;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'employees',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}

export async function deleteEmployees(ids: number[]) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.update.employees.fireByIds, [ids]);
}
