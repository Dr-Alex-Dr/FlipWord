import { Word } from "../Controllers/Word.js";
import { WordWithTranslation } from "../Controllers/Word.js"


export class Collection extends Word {
    constructor() {
        super()
    }

    async createCollection(telegramId: number, name: string, words: WordWithTranslation[], color: string): Promise<void> {
        try {
            const [userId] = await this.db.connect('SELECT id FROM User WHERE telegram_id = ?', [telegramId])
            
            const collectionInfo = await this.db.connect('INSERT INTO `Collection`(`name`, `color`, `user_id`) VALUES (?, ?, ?)', [
                name,
                color,
                userId.id,
            ]);

            for (let word of words) {
                this.createWord(telegramId, collectionInfo.insertId, word);
            }  
        }   
        catch(err) {
            console.log('addCollection error ' + err)
        }
    }

    deleteCollection() {

    }

    async editCollection(telegramId: number, name: string, words: WordWithTranslation[], color: string) {
        try {
            const [userId] = await this.db.connect('SELECT id FROM User WHERE telegram_id = ?', [telegramId])

            const collectionInfo = await this.db.connect('INSERT INTO `Collection`(`name`, `color`, `user_id`) VALUES (?, ?, ?)', [
                name,
                color,
                userId.id,
            ]);

            for (let word of words) {
                this.createWord(telegramId, collectionInfo.insertId, word);
            }  
        }   
        catch(err) {
            console.log('addCollection error ' + err)
        }
    }
}

