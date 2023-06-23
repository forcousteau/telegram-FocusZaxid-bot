import DB from '../../db/index';
import Queries from '../../queries/queries';
import RegistrateMessage from '../controllers/registrate';
import FiredMessage from '../controllers/fired';
import WorkingMessage from '../controllers/working';
import { getEmployees, getEmployeeByChatId } from '../../services/employees';

export async function addUser(data: { chatId: number; name?: string; fullName?: string; isAdmin?: boolean }) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.insert({
    tableName: 'telegramUsers',
    columns,
  });
  await pool.query(query, values);
}

export async function getUsers() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.users.all);
  return res.rows;
}

export async function getUserByChatId(chatId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.users.byChatId, [chatId]);
  return res.rows[0];
}

export async function getAdmins() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.admins.all);
  return res.rows;
}

export async function isAdmin(chatId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.admins.byChatId, [chatId]);
  return res.rowCount > 0;
}

export async function sendGlobal(ctx, message) {
  const users = await getUsers();
  for (const { chatId } of users) {
    if (chatId !== ctx.from.id) {
      try {
        await ctx.telegram.sendCopy(chatId, message);
      } catch (err) {
        console.debug(err);
      }
    }
  }
}

export async function addAdmin(chatId: number) {
  const user = await getUserByChatId(chatId);
  if (!user) {
    throw new Error('No user with such chatId in database');
  }
  const pool = DB.getPool();
  const res = await pool.query(Queries.update.admins.addByChatId, [user.id]);
}

export async function dismissAdmin(chatId: number) {
  const user = await getUserByChatId(chatId);
  if (!user) {
    throw new Error('No user with such chatId in database');
  }
  const pool = DB.getPool();
  const res = await pool.query(Queries.update.admins.deleteByChatId, [user.id]);
  return user;
}

export async function sendLocationRequests(locationCheckId: number) {
  const employees = await getEmployees();

  for (const { chatId } of employees) {
    try {
      await WorkingMessage.send(chatId, locationCheckId);
    } catch (err) {
      console.error(err);
    }
  }
}

export async function checkEmployee(ctx, func, ...args) {
  const user = await getUserByChatId(ctx.from.id);
  if (!user) {
    return ctx.scene.enter('getRegistrationCode');
  }

  const employee = await getEmployeeByChatId(ctx.from.id);
  if (!employee) {
    return RegistrateMessage.send(ctx);
  }

  if (employee.isFired) {
    return FiredMessage.send(ctx);
  }

  return func(...args);
}
