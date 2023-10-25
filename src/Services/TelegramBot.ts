import { Telegraf, Context } from 'telegraf';
import { handleUserIsSubscriber } from '../Middlewares/UserOpportunitiesMiddleware.js';
import { User } from './User.js';
import 'dotenv/config';

export class TelegramBot {
    private bot: Telegraf;

    constructor() {
        this.bot = new Telegraf(process.env.BOT_TOKEN ?? '');
        this.configureBot();
    }

    private configureBot() {
        this.bot.start(this.handleStart);
        this.bot.use(handleUserIsSubscriber)
    }

    private async handleStart(ctx: Context, next: () => void) {
        const user = new User()

        const telegramId = ctx?.from?.id || 0;
        const userName = ctx?.from?.first_name || null;

        const userStatus = await user.authentication(telegramId);

        if (userStatus) {
            next();
        } else {
            user.registration(telegramId, userName, 1)
            next()
        } 
    }

    public start() {
        try {
            this.bot.launch(); 
        }
        catch(err) {
            console.log('Ошибка при запуске бота:', err)
        }
    }
}

