import DB from './db';
import Server from './server';
import Telegram from './telegram';
import Daemons from './daemons/';

async function main() {
  await DB.connect();
  await Server.init();
  await Telegram.init();
  await Daemons.init();
}

main();
