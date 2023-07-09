import DB from '../db/index';
import Queries from '../queries/queries';
import { getObjectById } from './objects';
import { getVars } from './vars';

export async function insertCarRecord(data: {
  carId: number | string,
  objectId: number | string,
  employeeId?: number | string,
}) {
  try {
    const pool = DB.getPool();
    const car = await pool.query(Queries.select.cars.activeById, [data.carId]);
    const destinationObject = await getObjectById(data.objectId);
    const distance = destinationObject.distanceInKM;
    const vars = await getVars();
    const fuelPrice = vars.find(elem => elem.name === car.rows[0].fuelType + 'Price').value || 0;
    const fuelConsumption = car.rows[0].fuelConsumption;
    const suspensionPrice = vars.find(elem => elem.name === 'suspensionPrice').value;

    const { columns, values } = Queries.convertObjectToColumnsAndValues({
      carId: data.carId, objectId: data.objectId, employeeId: data.employeeId, fuelPrice, fuelConsumption, suspensionPrice, distance
    });
    const query = Queries.build.insert({
      tableName: 'carRecords',
      columns
    });
    await pool.query(query, values);
  } catch (err) {
    console.error(err, 'Error on create carRecord')
  }

}

export async function getCarRecordsByMonth(year: number, month: number) {
  const pool = DB.getPool();
  const {rows} = await pool.query(Queries.select.carRecords.forTableByDays, [year, month + 1]);

  return rows.map(carRecord => {
    carRecord.fuelFullPrice = (Number(carRecord.distance) * 2) * (Number(carRecord.fuelConsumption) / 100) * Number(carRecord.fuelPrice);
    carRecord.suspensionFullPrice = (Number(carRecord.distance) * 2) * Number(carRecord.suspensionPrice);
    carRecord.travelFullPrice = carRecord.fuelFullPrice + carRecord.suspensionFullPrice;
    return carRecord;
  });
}