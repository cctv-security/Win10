import { Telegraf } from 'telegraf';
import axios from 'axios';

const bot = new Telegraf('7843013455:AAHoxAjuDvqqithc92FHEheSy4rmnlIOeX8');
const adminId = 927899812;

bot.start((ctx) => {
    ctx.reply('مرحبا! كيف يمكنني مساعدتك اليوم؟');
});

bot.command('sms', (ctx) => {
    if (ctx.from.id === adminId) {
        ctx.reply('الرجاء إدخال كلمة المرور:');
        bot.on('text', async (ctx) => {
            if (ctx.message.text === '33221') {
                await ctx.reply('أدخل اسم أو رقم المرسل:');
                bot.on('text', async (ctx) => {
                    const sender = ctx.message.text;
                    await ctx.reply('أدخل الرقم المتلقي:');
                    bot.on('text', async (ctx) => {
                        const recipient = ctx.message.text;
                        await ctx.reply('أدخل الرسالة:');
                        bot.on('text', async (ctx) => {
                            const message = ctx.message.text;
                            if (message.includes('http') || message.includes('www')) {
                                ctx.reply('الرسائل التي تحتوي على روابط غير مسموحة.');
                            } else {
                                const data = {
                                    sender,
                                    recipient,
                                    message
                                };
                                const response = await fetch('https://gateway.seven.io/api/sms', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-Api-Key': '6aEac3903B47733a9908b148fB6F3eaCB970aa65E2561Fa95ed6912172DDB3E3'
                                    },
                                    body: JSON.stringify(data)
                                });
                                const result = await response.json();
                                if (result.success) {
                                    ctx.reply('تم إرسال الرسالة بنجاح!');
                                } else {
                                    ctx.reply('فشل في إرسال الرسالة.');
                                }
                            }
                        });
                    });
                });
            } else {
                ctx.reply('كلمة المرور غير صحيحة.');
            }
        });
    } else {
        ctx.reply('هذه الميزة مخصصة للإدمن فقط.');
    }
});

// تعديل القسم الذي يستخدم g4f إلى OpenAI باستخدام axios
bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    
    const options = {
        method: 'POST',
        url: 'https://gpt-4o.p.rapidapi.com/chat/completions',
        headers: {
            'x-rapidapi-key': 'c1cbbdec0amsh946bd0afd3ac951p16722ejsnac0630e39161',
            'x-rapidapi-host': 'gpt-4o.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        data: {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        }
    };

    try {
        const response = await axios.request(options);
        const result = response.data;
        ctx.reply(result.choices[0].message.content);  // الرد برسالة GPT-4
    } catch (error) {
        console.error(error);
        ctx.reply('حدث خطأ أثناء معالجة الرسالة.');
    }
});

bot.launch();
console.log('Bot is running...');
