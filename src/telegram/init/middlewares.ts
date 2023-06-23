import path from 'path';
import { getFilesRecursively } from '../../services/functions';

const Middlewares = {
  init: async bot => {
    try {
      // Подключение всех модулей в папке ../middlewares/
      const middlewaresRoot = path.join(__dirname, '../middlewares/');
      const files = await getFilesRecursively(middlewaresRoot);

      files
        .filter(filename => path.extname(filename) === '.js' && path.basename(filename)[0] !== '_')
        .map(file => require(file).default)
        .forEach(middleware => bot.use(middleware));

      console.log('>>> [Telegram] Middlewares initialized');
    } catch {
      console.error('XXX Произошла ошибка при инициализации прослоек!');
      process.exit(1);
    }
  },
};

export default Middlewares;
