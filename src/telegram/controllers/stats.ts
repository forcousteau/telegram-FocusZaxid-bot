import * as api from 'telegraf';
import AdminMessage from './admin';
import { getAllUsersCount } from '../../services/stats';

const StatsMessage = {
  async send(ctx: api.ContextMessageUpdate): Promise<void> {
    const allUsersCount = await getAllUsersCount();
    await ctx.replyWithHTML(
      `<b>Статистика 📊</b>\n\nКол-во пользователей: <b>${allUsersCount}</b>`,
      AdminMessage.keyboard
    );
  },
};

export default StatsMessage;
