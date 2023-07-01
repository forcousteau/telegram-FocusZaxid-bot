import { isObject } from '../../services/functions';
import { addCar, getCarsForAdminPanel, updateCar } from '../../services/cars';

const handlers = {
  create: async ctx => {
    const {
        name,
        fuelType,
        fuelConsumption,
        isCompanyProperty,
        isActive 
    } = ctx.request.body;

    if (!name || !fuelType || !fuelConsumption || typeof fuelConsumption !== 'number') {
      return (ctx.status = 400);
    }

    try {
      await addCar({
        name,
        fuelType,
        fuelConsumption,
        isCompanyProperty,
        isActive 
      });
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const cars = await getCarsForAdminPanel();
      ctx.status = 200;
      const body = {
        cars,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  update: async ctx => {
    const { id, data } = ctx.request.body;

    if (!id || !data || !isObject(data) || !Object.keys(data).length) {
      return (ctx.status = 400);
    }

    try {
      await updateCar(id, data);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
