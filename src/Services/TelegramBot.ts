import { Telegraf, Context } from 'telegraf';
import { handleUserIsSubscriber } from '../Middlewares/UserOpportunitiesMiddleware.js';
import { Task } from './Task.js';
import { User } from './User.js';
import 'dotenv/config';

export class TelegramBot {
    private bot: Telegraf;
    private task: Task;

    constructor() {
        this.task = new Task();
        this.bot = new Telegraf(process.env.BOT_TOKEN ?? '');
        this.configureBot();
    }

    private configureBot() {
        this.bot.start(this.handleStart);
        this.bot.use(handleUserIsSubscriber)
        this.bot.on('text', (ctx: Context) => { this.task.generatesTest(2, ctx) })
        //this.bot.on('text', (ctx: Context) => { this.editMessage(ctx) })
    }

    private async handleStart(ctx: Context, next: () => void) {
        const user = new User()

        const telegramId = ctx?.from?.id || 0;
        const userName = ctx?.from?.first_name || null;

        const userStatus = await user.authentication(telegramId);
        
        if (userStatus) {
            next();
        } 
        else {
            user.registration(telegramId, userName, 1)
            next()
        }  
    }

    public async editMessage(ctx: Context) {
        try {
            const message = await ctx.reply('▫️▫️▫️▫️▫️▫️▫️▫️▫️▫️');

            for (let i = 0; i < 40; i++) {
                await new Promise(resolve => setTimeout(resolve, 100 + (i * 5)));
               
                
                await ctx.telegram.editMessageText(
                  message.chat.id,
                  message.message_id,
                  undefined,
                  this.task.generateIndecator(40, i)
                );
            }
            
          } catch (error) {
            console.error(error);
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


