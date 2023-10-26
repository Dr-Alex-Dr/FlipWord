import { Context } from 'telegraf';


export class Task {
    
    constructor() {

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
        return resultStr.join('')
    }

    public generateTask(telegramId: number, collectionId: number) {

    }

    public visualizationTask(ctx: Context) {
        ctx.reply(this.generateIndecator(40, 0));
    }
}

