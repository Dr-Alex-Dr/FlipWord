import { Word } from "./Word.js";
import { WordWithTranslation } from "./Word.js"


export class Collection extends Word {
    constructor() {
        super()
    }

    async createCollection(telegramId: number, name: string, words: WordWithTranslation[] | null, color: string): Promise<void> {
        try {
            const [userId] = await this.db.connect('SELECT id FROM User WHERE telegram_id = ?', [telegramId])
            
            const collectionInfo = await this.db.connect('INSERT INTO `Collection`(`name`, `color`, `user_id`) VALUES (?, ?, ?)', [
                name,
                color,
                userId.id,
            ]);

            if (words !== null) {
                for (let word of words) {
                    this.createWord(telegramId, collectionInfo.insertId, word);
                } 
            } 
        }   
        catch(err) {
            console.log('addCollection error ' + err)
        }
    }

    async deleteCollection(collectionId: number): Promise<void> {
        try {
            let wordIds = await this.db.connect('SELECT word_id FROM `Word_in_collection` WHERE collection_id = ?', [collectionId]);

            for (let word of wordIds) {
                this.deleteWord(word.word_id)
            }   

            await this.db.connect('DELETE FROM `Collection` WHERE id = ?', [collectionId])       
        }   
        catch(err) {
            console.log('deleteCollection error ' + err)
        }
    }

    async editCollection(collectionId: number, name: string): Promise<void> {
        try {
            await this.db.connect('UPDATE `Collection` SET name = ? WHERE id = ?', [name, collectionId])
        }   
        catch(err) {
            console.log('editCollection error ' + err)
        }
    }
}

