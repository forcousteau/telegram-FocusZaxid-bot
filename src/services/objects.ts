import DB from '../db/index';
import Queries from '../queries/queries';

export async function addObject(data: {
  regionId: number;
  city: string;
  address: string;
  contractorId: number | null;
}) {
  const { regionId, city, address, contractorId } = data;
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.object, [regionId, city, address, contractorId]);
}

export async function getObjectsForAdminPanel() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.objects.forAdminPanel);
  return res.rows;
}

export async function getActiveObjectsByRegionId(regionId: string) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.objects.activeByRegionId, [regionId]);
  return res.rows;
}

export async function updateObject(
  id: number,
  data: {
    regionId?: number;
    city?: string;
    address?: string;
    isActive?: boolean;
    contractorId?: number;
  }
) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'objects',
    columns,
    where: `id = ${id}`,
  });
  const res = await pool.query(query, values);
}

export async function sendObjects(ctx, objects, portion = 15) {
  const offset = ctx.inlineQuery.offset ? ctx.inlineQuery.offset : '0';

  objects.sort((a: any, b: any) => {
    if (a.city > b.city) {
      return 1;
    }
    if (a.city < b.city) {
      return -1;
    }
    return 0;
  });

  let results = [];

  const currObjects = objects.slice(+offset, +offset + portion);
  const nextOffset = currObjects.length === portion ? (+offset + portion).toString() : '';
  const limit = nextOffset !== '' ? +nextOffset : +offset + currObjects.length;

  for (let i = +offset; i < limit; i++) {
    let { id, city, address } = objects[i];

    results.push({
      id: id,
      type: 'article',
      title: city,
      description: address,
      input_message_content: {
        message_text: `<b>${city}</b>`,
        parse_mode: 'HTML',
      },
    });
  }

  await ctx.answerInlineQuery(results, {
    cache_time: 0,
    next_offset: nextOffset,
  });
}
