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



// import { Word } from "./Services/Word.js";

// let word = new Word()
// word.createWord(968615914, 2, {
//     word: 'dog', 
//     translations: 'собака'
// })
// word.createWord(968615914, 2, {
//     word: 'house', 
//     translations: 'дом'
// })
// word.createWord(968615914, 2, {
//     word: 'three', 
//     translations: 'три'
// })
// word.createWord(968615914, 2, {
//     word: 'underground', 
//     translations: 'метро'
// })  
// word.createWord(968615914, 2, {
//     word: 'Christmas tree', 
//     translations: 'елка'
// })  
// word.createWord(968615914, 2, {
//     word: 'laptop', 
//     translations: 'ноутбук'
// })  
// word.createWord(968615914, 2, {
//     word: 'print', 
//     translations: 'печать'
// })  