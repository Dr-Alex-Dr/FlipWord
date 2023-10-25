import { User } from "../Services/User.js";
import { Context } from 'telegraf';

export async function handleUserIsSubscriber(ctx: Context, next: () => void) {
    const user = new User()
    
    const telegramId = ctx?.from?.id || 0;
    const userStatus = await user.isSubscriber(telegramId);

    if (userStatus) {
        next();
    } else {
        ctx.reply(`Кажется у вас все еще нет подписки`)
    }
}