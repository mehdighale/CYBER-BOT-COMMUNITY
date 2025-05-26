module.exports.config = {
  name: "كف",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "اعطي واحد صفعة محترمة عالسريع",
  commandCategory: "الضحك والتفريغ النفسي",
  usages: "صفعة [منشن واحد من المتعوسين]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

  if (!args.join("")) return out("⚠️ لازم تِمنشن واحد عشان نكفخه");

  return axios.get('https://api.waifu.pics/sfw/slap').then(res => {
    let getURL = res.data.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");

    let callback = function () {
      api.setMessageReaction("✋", event.messageID, (err) => {}, true);
      api.sendMessage({
        body: `بووووم!! صفعة خرافية لـ ${tag} 💥\n\n🤣 آسف حسبتك بعوضة تتحرش`,
        mentions: [{
          tag: tag,
          id: mention
        }],
        attachment: fs.createReadStream(__dirname + `/cache/slap.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/slap.${ext}`), event.messageID);
    };

    request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/slap.${ext}`)).on("close", callback);
  })
  .catch(err => {
    api.sendMessage("❌ فشل تحميل الصفعة، يمكن اليد تعبت؟ جرب تاني!", event.threadID, event.messageID);
    api.setMessageReaction("😿", event.messageID, (err) => {}, true);
  });
}
