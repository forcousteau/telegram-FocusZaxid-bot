import { Markup } from 'telegraf';
import Scene from 'telegraf/scenes/base';

const Prototypes = {
  init() {
    /**
     * Прототипы класса Scene
     */
    Scene.prototype.next = async function (ctx, message?) {
      const { nextScene } = this;

      switch (typeof nextScene) {
        case 'string':
          return ctx.scene.enter(nextScene);
        case 'object':
          return message ? nextScene.send(ctx, message) : nextScene.send(ctx);
        case 'function':
          return nextScene(ctx);
        case 'undefined':
          return;
        default:
          throw new TypeError(`Неверно указана следующая сцена`);
      }
    };

    Scene.prototype.leave = async function (ctx) {
      await ctx.scene.leave();
    };

    Scene.prototype.back = async function (ctx) {
      if (!ctx.session.__scenes) return;

      const currentSceneId = ctx.session.__scenes.current;
      const { backScene } = ctx.scene.scenes.get(currentSceneId);

      await ctx.scene.leave();

      switch (typeof backScene) {
        case 'string':
          await ctx.scene.enter(backScene);
          break;
        case 'object':
          await backScene.send(ctx);
          break;
        case 'function':
          await backScene(ctx);
          break;
        case 'undefined':
          break;
        default:
          throw new TypeError(`Неверно указана сцена возврата в ${currentSceneId}`);
      }
    };

    Scene.prototype.reenter = async function (ctx) {
      await ctx.scene.reenter();
    };

    Scene.prototype.checkInInlineKeyboard = async function (ctx, selectedData) {
      const checkedEmoji = '✅';
      const { inline_keyboard } = ctx.update.callback_query.message.reply_markup;

      let found = false;

      for (const row of inline_keyboard) {
        for (const button of row) {
          if (button.callback_data === selectedData && button.text[0] !== checkedEmoji) {
            button.text = `${checkedEmoji} ${button.text}`;
            found = true;
          }
        }
      }

      if (found) {
        await ctx.editMessageReplyMarkup({ inline_keyboard });
      }
    };

    Scene.prototype.backKeyboard = Markup.keyboard([Markup.button('⏪ Назад')]).resize();

    Scene.prototype.backInlineKeyboard = Markup.inlineKeyboard([Markup.callbackButton('⏪ Назад', 'back')]);
  },
};

export default Prototypes;
