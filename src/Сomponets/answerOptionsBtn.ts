export function answerOptionBtn(...variants: string[]) {
    return {
        inline_keyboard: [
            [{ text: variants[0], callback_data: variants[0] }],
            [{ text: variants[1], callback_data: variants[1] }],
            [{ text: variants[2], callback_data: variants[2] }],
            [{ text: variants[3], callback_data: variants[3] }],
        ],
    };
    
}



