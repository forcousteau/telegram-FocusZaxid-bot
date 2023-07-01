import DB from '../db/index';
import Queries from '../queries/queries';

export async function addCar(data: {
    name?: string;
    fuelType?: string;
    fuelConsumption?: number;
    isCompanyProperty?: boolean;
    isActive?: boolean;
}) {
    const pool = DB.getPool();
    const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
    const query = Queries.build.insert({
      tableName: 'cars',
      columns
    });
    await pool.query(query, values);
}

export async function getFuelTypes() {
    const pool = DB.getPool();
    const res = await pool.query(Queries.select.cars.fuelTypes);
    return res.rows;
}

export async function getCarsByFuelType(fuelType) {
    const pool = DB.getPool();
    const res = await pool.query(Queries.select.cars.activeByFuelType, [fuelType]);
    return res.rows;
}

export async function getCarsForAdminPanel() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.cars.forAdminPanel);
  return res.rows;
}

export async function getActiveCars() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.cars.active);
  return res.rows;
}

export async function updateCar(
  id: number,
  data: {
    name?: string;
    fuelType?: string;
    fuelConsumption?: number;
    isCompanyProperty?: boolean;
    isActive?: boolean;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'cars',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}

export async function sendCars(ctx, cars, portion = 15) {
    const offset = ctx.inlineQuery.offset ? ctx.inlineQuery.offset : '0';
  
    cars.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  
    let results = [];
  
    const currCars = cars.slice(+offset, +offset + portion);
    const nextOffset = currCars.length === portion ? (+offset + portion).toString() : '';
    const limit = nextOffset !== '' ? +nextOffset : +offset + currCars.length;
  
    for (let i = +offset; i < limit; i++) {
      let { id, name } = cars[i];
  
      results.push({
        id: id,
        type: 'article',
        title: name,
        input_message_content: {
          message_text: `<b>${name}</b>`,
          parse_mode: 'HTML',
        },
      });
    }
    await ctx.answerInlineQuery(results, {
      cache_time: 0,
      next_offset: nextOffset,
    });
  }
  