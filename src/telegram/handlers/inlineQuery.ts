import { getActiveObjectsByRegionId, sendObjects } from '../../services/objects';
import { getEmployeeByChatId } from '../../services/employees';
import { getCarsByFuelType, sendCars } from '../../services/cars';

const InlineQueryHandlers = {
  init: bot => {
    bot.on('inline_query', async ctx => {
      const employee = await getEmployeeByChatId(ctx.from.id);
      if (!employee) return;

      const query = ctx.update.inline_query.query.split('>');

      if (query[0] == 'regionId') {
        const [objectSearchData] = [...query].reverse();
        const [regionId, ...searchQueryArr] = objectSearchData.split(' ');
        const searchQuery = searchQueryArr.join(' ');
        let objects = await getActiveObjectsByRegionId(regionId);
        objects.sort((a, b) => {
          if (a.city.localeCompare(b.city) > 0) {
            return 1;
          } else if (a.city.localeCompare(b.city) < 0) {
            return -1;
          } else {
            if (a.address.localeCompare(b.address) > 0) {
              return 1;
            } else if (a.address.localeCompare(b.address) < 0) {
              return -1;
            } else {
              return 0;
            }
          }
        });

        objects = objects.filter(obj => {
          return (
            obj.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obj.address?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        await sendObjects(ctx, objects);
      }
      if (query[0] == 'fuelType') {
        const [fuelType] = [...query].reverse();
        let cars = await getCarsByFuelType(fuelType);

        await sendCars(ctx, cars);
      }
    });

    bot.on('chosen_inline_result', async ctx => {
      const { result_id, query } = ctx.update.chosen_inline_result;
      if (query.split('>')[0] == 'regionId') {
        switch (query.split('>')[1]) {
          case 'open': {
            ctx.session.openWorkShift.objectId = result_id;
            await ctx.scene.enter('openWorkShift/getCar');
          }
        }
      }
      if (query.split('>')[0] == 'fuelType') {
        switch (query.split('>')[1]) {
          case 'open': {
            ctx.session.openWorkShift.carId = result_id;

            await ctx.scene.enter('openWorkShift/getLocation');
          }
        }
      }
    });
  },
};

export default InlineQueryHandlers;
