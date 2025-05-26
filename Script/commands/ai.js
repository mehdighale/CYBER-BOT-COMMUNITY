const fs = require("fs");
const path = __dirname + "/yuki_data.json";

module.exports.config = {
  name: "يونا",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "دردشة مع يونا - بوت ذكي مع تعليم داخلي",
  commandCategory: "الذكاء الصناعي",
  usages: "[كلام] | [تشغيل / إيقاف]",
  cooldowns: 2
};

// تحميل قاعدة البيانات أو إنشاؤها
let yukiData = {};
if (fs.existsSync(path)) {
  yukiData = JSON.parse(fs.readFileSync(path, "utf8"));
} else {
  fs.writeFileSync(path, JSON.stringify({}));
}

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ");
  const threadData = await Threads.getData(threadID);
  const chatBotState = threadData.data.yukichatbot ?? false;

  // تشغيل / إيقاف
  if (args[0] == "تشغيل") {
    if (event.senderID != api.getCurrentUserID() && !global.config.ADMINBOT.includes(senderID)) {
      return api.sendMessage("🈯 | فقط الأدمن يقدر يشغّل البوت!", threadID, messageID);
    }
    threadData.data.yukichatbot = true;
    await Threads.setData(threadID, threadData);
    return api.sendMessage("✅ | تم تشغيل يونا للرد التلقائي", threadID, messageID);
  }

  if (args[0] == "إيقاف") {
    threadData.data.yukichatbot = false;
    await Threads.setData(threadID, threadData);
    return api.sendMessage("✅ | تم إيقاف الرد التلقائي ليونا", threadID, messageID);
  }

  // تعليم
  if (content.includes("=>")) {
    const [key, reply] = content.split("=>").map(t => t.trim());
    if (!key || !reply) {
      return api.sendMessage("❗ | الصيغة غير صحيحة. مثال:\nيونا أنا جوعان => روح كل قبل ما أنفجر", threadID, messageID);
    }
    yukiData[key.toLowerCase()] = reply;
    fs.writeFileSync(path, JSON.stringify(yukiData, null, 2));
    return api.sendMessage("✅ | تم تعليم يونا الرد الجديد بنجاح!", threadID, messageID);
  }

  // رد تلقائي
  if (!content) {
    return api.sendMessage(`❓ | يونا بانتظار كلامك...\n\nمثال:\nيونا أحبك`, threadID, messageID);
  }

  const response = yukiData[content.toLowerCase()];
  if (response) {
    return api.sendMessage(response + " 🌝", threadID, messageID);
  } else {
    return api.sendMessage("هممم... مش فاهمة عليك! علّمني إذا حبيت 🌝", threadID, messageID);
  }
};

module.exports.handleEvent = async function({ api, event, Threads }) {
  const { threadID, body, senderID } = event;
  if (!body || senderID == api.getCurrentUserID()) return;
  const threadData = await Threads.getData(threadID);
  const chatBotState = threadData.data.yukichatbot ?? false;
  if (!chatBotState || body.startsWith(global.config.PREFIX)) return;

  const response = yukiData[body.toLowerCase()];
  if (response) {
    api.sendMessage(response, threadID);
  }
};
