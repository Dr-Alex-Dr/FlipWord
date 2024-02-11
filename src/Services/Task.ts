import { Context } from 'telegraf';
import { answerOptionBtn } from '../Сomponets/answerOptionsBtn.js';
import { InitializeDatabase } from '../InitializeDatabase.js'; 

interface IWordInBd {
    word: string
}


export class Task {
    public db: InitializeDatabase;

    constructor() {
        this.db = new InitializeDatabase()
    }

    generateIndecator(countTask: number, numberTask: number): string {
        let arraySymbols = ['◽️', '◻️', '⬜️', '🟩']
    
        let squaresInLine = Math.ceil(countTask / 4)
        let numberInLine: number = Math.trunc(numberTask / 4)
        let numberSymbol = numberTask % 4
    
        const resultStr = Array(squaresInLine).fill('▫️');
      
        for (let i = 0; i < numberInLine; i++) {
            resultStr[i] = arraySymbols[3]
        }
        resultStr[numberInLine] = arraySymbols[numberSymbol]
        resultStr.push('⠀')
        return resultStr.join('')
    }

    // метод создает слово и перевод
    async generateWordTranslationTask(wordId: number, ctx: Context) {
        const [task] = await this.db.connect(`
            SELECT * FROM Word WHERE id = ${wordId}
        `)

        ctx.replyWithAudio(
            { source: `./src/media/${task.word}.ogg`}, 
            { 
                caption: `${task.word} - ${task.translation}`,
                reply_markup: { inline_keyboard: [[{ text: 'Готово', callback_data: 'done' }]]},
               
            }       
        );
    }
   
    // метод создает слово на русском, варианты на английском
    private async generateRussianWordWithEnglishVariantsTask(wordId: number, ctx: Context) { 
        const [task] = await this.db.connect(`
            SELECT * FROM Word WHERE id = ${wordId}
        `)

        const variants: IWordInBd[] = await this.db.connect(`
            SELECT word FROM (
            (SELECT word FROM Word WHERE id = ${wordId})
            UNION ALL
            (SELECT word FROM Word WHERE id != ${wordId} ORDER BY RAND() LIMIT 3)
            ) AS subquery ORDER BY RAND()            
        `)

        ctx.replyWithAudio(
            { source: `./src/media/${task.word}.ogg`}, 
            { 
                caption: `${task.translation}`,
                reply_markup: answerOptionBtn(variants[0].word, variants[1].word, variants[2].word, variants[3].word),
               
            }       
        );
    }

    // метод создает слово на английском, варианты на русском
    private generateEnglishWordWithRussianVariantsTask(collectionId: number) {

    }

    // метод создает аудио на английском, варианты на русском
    private generateAudioTaskWithEnglishVariantsRussian(collectionId: number) {

    }

    // метод создает аудио на английском, написать на английском
    private generateAudioTaskWithEnglishWriteEnglish(collectionId: number) {

    }

    
    public async generatesTest(collectionId: number, ctx: Context) {
        // выбираем случаное слово 
        const [randomWord] = await this.db.connect(`
            SELECT * FROM Word WHERE Word.id IN 
            (SELECT word_id FROM Word_in_collection WHERE collection_id IN 
            (SELECT id FROM Collection WHERE id = ${collectionId})) ORDER BY rand() LIMIT 1  
        `)
    
        switch (randomWord.progress) {
            case 0:
                this.generateWordTranslationTask(randomWord.id, ctx)
                break;
            case 0.2:
                this.generateRussianWordWithEnglishVariantsTask(randomWord.id, ctx)
                break;
            case 0.4:
                console.log( 'Перебор' );
                break;
            case 0.6:
                console.log( 'Перебор' );
                break;
            case 0.8:
                console.log( 'Перебор' );
                break;
          }
        
       
    }

    public visualizationTask(ctx: Context, word: string) {
        // ctx.reply(this.generateIndecator(40, 33));
        // ctx.reply('3/12')
        ctx.replyWithAudio(
            { source: `./src/media/${word}.ogg`}, 
            { 
                caption: `${word}⠀⠀⠀⠀⠀⠀`,
                reply_markup: answerOptionBtn('голова', 'шапка', 'шагать', 'бег'),
               
            }       
        );
    }
}

