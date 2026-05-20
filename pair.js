const express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
let router = express.Router()
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser
} = require("@whiskeysockets/baileys");
const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    let num = req.query.number;
    async function DanuwaPair() {
        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        try {
            let DanuwaPairWeb = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!DanuwaPairWeb.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await DanuwaPairWeb.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            DanuwaPairWeb.ev.on('creds.update', saveCreds);
            DanuwaPairWeb.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    try {
                        await delay(10000);
                        const sessionDanuwa = fs.readFileSync('./session/creds.json');

                        const auth_path = './session/';
                        const user_jid = jidNormalizedUser(DanuwaPairWeb.user.id);

                      function randomMegaId(length = 6, numberLength = 4) {
                      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      let result = '';
                      for (let i = 0; i < length; i++) {
                      result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                       const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                        return `${result}${number}`;
                        }

                        const mega_url = await upload(fs.createReadStream(auth_path + 'creds.json'), `("𝕃𝔸ℝ𝔸-𝕄𝔻=)+${randomMegaId()}.json`);

                        const string_session = mega_url.replace('https://mega.nz/file/', '');

                        const sid = "𝕃𝔸ℝ𝔸-𝕄𝔻="+string_session;

                        const dt = await DanuwaPairWeb.sendMessage(user_jid, {
                            text: sid
                        });
                        const desc = `
✾━┫ *⚬Lααɾα-ꜱᴇꜱꜱɪᴏɴ⚬* ┣━✾
                   *ᴸ  ͣ  ͣ  ͬ  ͣ  ✻  ᴸ  ͣ  ͣ  ͬ  ͣ*

*𝙻𝚊𝚛𝚊 𝙼𝙳 𝚜𝚎𝚜𝚜𝚒𝚘𝚗 𝚒𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 ✅*

*𝗔𝗧𝗧𝗘𝗡𝗧𝗜𝗢𝗡* ⚠️

_𝚃𝚑𝚒𝚜 𝚒𝚜 𝚢𝚘𝚞𝚛 𝚠𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝚕𝚘𝚐𝚒𝚗𝚐 𝚌𝚘𝚍𝚎. 𝙳𝚘𝚗'𝚝 𝚜𝚑𝚎𝚊𝚛 𝚊𝚗𝚢𝚘𝚗𝚎 ❌_

𝗢𝗪𝗡𝗘𝗥 🛠️

𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 :
https://www.facebook.com/share/1CWyrVEcK9/

𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 :
https://www.instagram.com/sadeesha_min?igsh=bWRlem5jMTA5OHo4

𝚈𝚘𝚞𝚃𝚞𝚋𝚎 :
https://www.youtube.com/channel/UC7473CyG_w74rHZl-uQA64g

> *ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ*
`; 
                        await DanuwaPairWeb.sendMessage(user_jid, {
text: desc,
contextInfo: {
externalAdReply: {
title: "𝙎𝘼𝘿𝙀𝙀𝙎𝙃𝘼 𝘾𝙊𝘿𝙀𝙍 👨🏻‍💻",
thumbnailUrl: "https://raw.githubusercontent.com/tharumin/Alexa_Voice/refs/heads/main/STK-20260116-WA0002.png",
sourceUrl: "https://whatsapp.com/channel/0029VaD5t8S1nozDfDDjRj2J",
mediaType: 1,
renderLargerThumbnail: false
}  
}
});
                        DanuwaPairWeb.newsletterFollow("120363192254044294@newsletter");
                        DanuwaPairWeb.groupAcceptInvite('Ci5mDk9zEVF95NcuqEtzl4');

                    } catch (e) {
                        exec('pm2 restart danuwa');
                    }

                    await delay(100);
                    return await removeFile('./session');
                    process.exit(0);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    DanuwaPair();
                }
            });
        } catch (err) {
            exec('pm2 restart danuwa-md');
            console.log("service restarted");
            DanuwaPair();
            await removeFile('./session');
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }
    return await DanuwaPair();
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    exec('pm2 restart danuwa');
});


module.exports = router;
