import { ContextMessageUpdate, Markup } from 'telegraf';
import { MessageSubTypes } from 'telegraf/typings/telegram-types';

export default interface IScene {
  backScene?: string | IMessage | Function | undefined;
  nextScene?: string | IMessage | Function | undefined;

  enter(handler: Function): Promise<void>;

  on(update_type: 'message' | MessageSubTypes, handler: Function): void;
  hears(text: string | RegExp, handler: Function): void;
  action(data: string | RegExp, handler: Function): void;
  command(command: string | RegExp, handler: Function): void;

  next(context: ContextMessageUpdate, message?: string): Promise<void>;
  back(context: ContextMessageUpdate): Promise<void>;
  leave(context: ContextMessageUpdate): Promise<void>;
  reenter(context: ContextMessageUpdate): Promise<void>;
  checkInInlineKeyboard(context: ContextMessageUpdate, selectData: string): Promise<void>;

  backKeyboard?: Markup;
  backInlineKeyboard?: Markup;
}

interface IMessage {
  send(context: ContextMessageUpdate);
}
