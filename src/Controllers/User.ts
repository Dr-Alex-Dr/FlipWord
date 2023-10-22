import { InitializeDatabase } from "../InitializeDatabase.js";
import moment from "moment";


export class User {
    private db: InitializeDatabase;

    constructor() {
        this.db = new InitializeDatabase()
    }

    async registration(telegramId: number, user_name: string | null, durationSubscription: number): Promise<void> {
        try {
            await this.db.connect('INSERT INTO `User`(`telegram_id`, `name`) VALUES (?, ?)', [
                telegramId,
                user_name
            ]);
            await this.makeSubscription(telegramId, durationSubscription);
        }
        catch(err) {
            console.log('Ошибка регистрации ' + err)
        }
    }

    async authentication(telegramId: number): Promise<boolean> {
        try {
            let user = await this.db.connect('SELECT * FROM User WHERE `telegram_id` = ?', [telegramId])

            if (user.length === 0) {
                return false
            }
            return true
        }
        catch(err) {
            console.log('Ошибка аунтификации ' + err)
            return false
        }
    }

    async isSubscriber(telegramId: number): Promise<boolean> {
        try {
            const subscribtionInfo = await this.db.connect(`
            SELECT Subscriber.end_subscription, Subscriber.start_subscription 
            FROM User
            LEFT JOIN Subscriber ON User.id = Subscriber.user_id
            WHERE User.telegram_id = ?`, [telegramId])

            if (subscribtionInfo[0].start_subscription === null || subscribtionInfo[0].end_subscription === null) {
                return false;
            }

            const currentData = moment(moment().format('YYYY-MM-DD')); // текущая дата
            const endSubscription = moment(subscribtionInfo[0].end_subscription); // дата окончания подписки
            
            // если текущая дата больше даты окончания, то false иначе true
            if(currentData.isBefore(endSubscription)) {
                return true;
            } 

            return false;
        }
        catch(err) {
            console.log('Ошибка проверки подписки ' + err)
            return false;
        }
    }

    async makeSubscription(telegramId: number, durationSubscription: number): Promise<void> {
        const currentDate = moment().format('YYYY-MM-DD')
        const endSubscription = moment().add(durationSubscription, 'months').format('YYYY-MM-DD')

        try {
            let sateSubscription = await this.db.connect(`
                SELECT User.id, Subscriber.user_id 
                FROM User
                LEFT JOIN Subscriber ON User.id = Subscriber.user_id
                WHERE User.telegram_id = ?`, [telegramId])

            if (sateSubscription[0].user_id === null) {
                // Если у пользователя нет подписки, создаем запись в таблице Subscriber 
                await this.db.connect('INSERT INTO `Subscriber`(`start_subscription`, `end_subscription`, `user_id`) VALUES (?, ?, ?)', [
                    currentDate,
                    endSubscription,
                    sateSubscription[0].id
                ])
            }
            else {
                // Если у пользователя уже есть подписка, просто обновляем subscriber_id.
                await this.db.connect(`UPDATE Subscriber SET start_subscription = ?, end_subscription = ? WHERE user_id = ?`, [
                    currentDate,
                    endSubscription,
                    sateSubscription[0].id 
                ]) 


            }          
        }   
        catch(err) {
            console.log('Ошибка оформления подписки ' + err)
        }      
    }   
}


