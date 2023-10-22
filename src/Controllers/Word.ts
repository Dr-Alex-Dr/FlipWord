import { InitializeDatabase } from "../InitializeDatabase.js"

type WordWithTranslations = {
    word: string;
    translations: string[];
}
export type WordWithTranslation = {
    word: string;
    translations: string; 
}

export class Word {
    public db: InitializeDatabase;

    constructor() {
        this.db = new InitializeDatabase()
    }

    async createWord(telegramId: number, collectionId: number, translateWord: WordWithTranslation): Promise<void> {
        try {
            const [userId] = await this.db.connect('SELECT id FROM User WHERE telegram_id = ?', [telegramId])

            let wordTableInfo = await this.db.connect('INSERT INTO `Word`(`user_id`, `word`, `translation`, `frequency`) VALUES (?, ?, ?, ?)', [
                userId.id,
                translateWord.word,
                translateWord.translations,
                1
            ]);

            this.addWordInCollection(wordTableInfo.insertId, collectionId);
        }   
        catch(err) {
            console.log('createWord error ' + err)
        }
    }

    deleteWord(WordInCollectinId: number) {
        // try {
        //     await this.db.connect('DELETE FROM `Word` WHERE ``', [
        //         collectionId,
        //         wordId
        //     ]);
        // }
        // catch(err) {

        // }
    }

    getWordTranslations(word: string): WordWithTranslations {
        // Тут обращаемся к api yandex
        return {
            word: word,
            translations: ['бежать', 'гонка', 'сбежать']
        }
    }

    

    private async addWordInCollection(wordId: number, collectionId: number): Promise<void> {
        try {
            await this.db.connect('INSERT INTO `Word_in_collection`(`collection_id`, `word_id`) VALUES (?, ?)', [
                collectionId,
                wordId
            ]);
        }
        catch(err) {
            console.log('addWordInCollection error ' + err)
        }
    }
}
