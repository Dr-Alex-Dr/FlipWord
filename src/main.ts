import { User } from "./Controllers/User.js";
import { Collection } from "./Controllers/Collection.js";

let user = new User()
let collection = new Collection()

let words = [
    {
        word: 'bagel',
        translations: 'рогалик'
    },
    {
        word: 'bagel',
        translations: 'бублик'
    }
]

collection.createCollection(123456789, 'Words from the Internet', words, '#ffffff')

// user.registration(123456789, 'Alex', 2)
// user.authentication(123456789).then(res => {
//     console.log(res)
// })
// user.isSubscriber(123456789).then(res => {
//     console.log(res)
// })
// user.makeSubscription(123456789, 4)
// user.isSubscriber(123456789).then(res => {
//     console.log(res)
// })