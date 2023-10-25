import express, { Express } from 'express';
import { router } from './routes.js';
import { TelegramBot } from './Services/TelegramBot.js';
import 'dotenv/config';

class App {
    private expressApp: Express;

    constructor() {
        this.expressApp = express();
        this.expressApp.use(express.json());

        this.setupRoutes();
    }

    private setupRoutes() {
        this.expressApp.use('/', router);

        this.expressApp.listen(3000, 'localhost', () => {
            console.log('Сервер запущен на порту 3000');
        });
    }
}

const app = new App();
let bot = new TelegramBot()
bot.start()
