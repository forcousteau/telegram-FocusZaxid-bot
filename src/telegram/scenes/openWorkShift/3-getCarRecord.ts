import IScene from "../../typings/scene";
import { getInlineKeyboardWithBackButton } from "../../helpers/keyboards";
import { fuelTypesWithName, getFuelTypes } from "../../../services/cars";


const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");

const scene: IScene = new Scene("openWorkShift/getCarRecord");

scene.backScene = "openWorkShift/getCar";
scene.nextScene = "openWorkShift/getLocation";

scene.enter(async (ctx: any) => {
  const keyboard = Markup.inlineKeyboard(
    [
      Markup.callbackButton("Так, пасажир ✅", "passenger>true"),
      Markup.callbackButton("Ні, водій ❌", "passenger>false"),
      Markup.callbackButton("Назад ⏪", "back"),
    ],
    { columns: 2 }
  );

  await ctx.telegram.sendMessage(ctx.from.id, "Ви пасажир?", {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
});
scene.action(/^passenger>/, async (ctx: any) => {
  ctx.answerCbQuery();
  const isPassenger = ctx.callbackQuery.data.split(">")[1];

  if (isPassenger === "false") {
    const fuelTypes = await getFuelTypes();
    const buttons = fuelTypes.map(fuelType => {
      return Markup.switchToCurrentChatButton(fuelTypesWithName[fuelType.fuelType] || fuelType.fuelType, 'fuelType>open>' + fuelType.fuelType);
    });
    const keyboard = await getInlineKeyboardWithBackButton(buttons, 2);
  
    await ctx.replyWithHTML("Тепер оберіть <b>автомобіль</b>", keyboard.extra());
  } else if (isPassenger === "true") {
    await ctx.scene.leave();
    await scene.next(ctx);
  } else {
    await ctx.reply("Не вдалось вибрати!");
    return ctx.scene.reenter();
  }
});

export default scene;
