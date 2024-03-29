import { InitializeDatabase } from "../InitializeDatabase.js";
import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';


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

            let wordTableInfo = await this.db.connect('INSERT INTO `Word`(`user_id`, `word`, `translation`) VALUES (?, ?, ?)', [
                userId.id,
                translateWord.word,
                translateWord.translations
            ]);

            this.addWordInCollection(wordTableInfo.insertId, collectionId);

            this.generateAudio(translateWord.word)
        }   
        catch(err) {
            console.log('createWord error ' + err)
        }
    }

    async deleteWord(wordId: number): Promise<void> {
        try {
            await this.db.connect('DELETE FROM `Word` WHERE id = ?', [
                wordId
            ]);
        }
        catch(err) {
            console.log('deleteWord error ' + err)
        }
    }

    async getWordTranslations(word: string): Promise<WordWithTranslations | undefined> {
        try {
            const allWord = await axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.YandexTranslateToken}&lang=en-ru&text=${word}`) 
            const translations = allWord.data.def.map((item: any) => item?.tr[0]?.text);
    
            return {
                word: word,
                translations
            }
        }
        catch(err) {
            console.log('getWordTranslations error ' + err)
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

    private async generateAudio(word: string) {
        try {
            let wordInDb = await this.db.connect('SELECT `word` FROM `Word` WHERE `word` = ?', ['dfdf'])

            if (wordInDb.length === 0) {
                const params = new URLSearchParams({
                    'text': word,
                    'lang': 'en-US',
                    'voice': 'john',
                    'format': 'mp3',
                    'speed': '0.8'
                });
        
                const result = await axios({
                    method: 'POST',
                    url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
                    headers: {
                    'Authorization': 'Api-Key ' + process.env.YandexSpeechkitToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: params,
                    responseType: 'stream',
                });
                
                result.data.pipe(fs.createWriteStream(`./src/media/${word}.ogg`));
            }
            
        }
        catch(err) {
            console.log('generateAudio error ' + err)
        }
    }
}
