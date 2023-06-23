import path from 'path';
import Scene from 'telegraf/scenes/base';
import Stage from 'telegraf/stage';
import AdminMessage from '../controllers/admin';
import HomeMessage from '../controllers/home';
import { getFilesRecursively } from '../../services/functions';
import { isAdmin, checkEmployee } from '../helpers/functions';

const Scenes = {
  init: async bot => {
    try {
      const stage = new Stage();

      // Установка общих обработчиков для всех сцен
      stage.start(async (ctx: any) => {
        await Scene.prototype.leave(ctx);
        ctx.session = {};
        await checkEmployee(ctx, async () => {
          await HomeMessage.send(ctx);
        });
      });

      stage.command('admin', async (ctx: any) => {
        if (await isAdmin(ctx.from.id)) {
          await Scene.prototype.leave(ctx);
          await AdminMessage.send(ctx);
          ctx.session = {};
        }
      });

      stage.action('back', async ctx => {
        await ctx.answerCbQuery();
        await Scene.prototype.back(ctx);
      });

      stage.hears('⏪ Назад', async ctx => await Scene.prototype.back(ctx));

      // Регистрируем все сцены в папке ../scenes
      const scenesRoot = path.join(__dirname, '../scenes/');
      const files = await getFilesRecursively(scenesRoot);

      files
        .filter(filename => path.extname(filename) === '.js' && path.basename(filename)[0] !== '_')
        .map(file => require(file).default)
        .forEach(scene => {
          stage.register(scene);
        });

      bot.use(stage.middleware());

      console.log('>>> [Telegram] Scenes registered');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },
};

export default Scenes;
