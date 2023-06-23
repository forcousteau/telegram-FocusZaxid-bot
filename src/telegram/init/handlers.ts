import path from 'path';
import { getFilesRecursively } from '../../services/functions';

const Handlers = {
  init: async bot => {
    try {
      // Подключение всех модулей в папке ../handlers/
      const handlersRoot = path.join(__dirname, '../handlers/');
      const files = await getFilesRecursively(handlersRoot);

      files
        .filter(filename => path.extname(filename) === '.js' && path.basename(filename)[0] !== '_')
        .map(file => require(file).default)
        .forEach(handler => handler.init(bot));

      console.log('>>> [Telegram] Handlers initialized');
    } catch (err) {
      console.error(
        'XXX Произошла ошибка при инициализации обработчиков!\nПопробуйте удалить неиспользуемые обработчики в /dist',
        err
      );
      process.exit(1);
    }
  },
};

export default Handlers;
