const num = 10; // عدد المرات المسموح بها قبل البان
const timee = 120; // خلال كم ثانية يتم احتساب السبام

module.exports.config = {
  name: "بان_سبام",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "يونو ",
  description: `يحظر المستخدم الذي يرسل أوامر أكثر من ${num} خلال ${timee} ثانية`,
  commandCategory: "الحماية",
  usages: "x",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    `⚠️ سيتم حظر أي مستخدم يرسل أكثر من ${num} أوامر خلال ${timee} ثانية تلقائيًا.\n\nخلك رايق!`,
    event.threadID,
    event.messageID
  );
};

module.exports.handleEvent = async function ({ Users, Threads, api, event }) {
  const { senderID, threadID } = event;

  // تجاهل الرسائل بدون أوامر
  const threadData = global.data.threadData.get(threadID) || {};
  const prefix = threadData.PREFIX || global.config.PREFIX;
  if (!event.body || !event.body.startsWith(prefix)) return;

  if (!global.client.autoban) global.client.autoban = {};

  if (!global.client.autoban[senderID]) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      count: 1
    };
  } else {
    const data = global.client.autoban[senderID];

    if ((Date.now() - data.timeStart) > timee * 1000) {
      // إعادة ضبط العداد بعد انتهاء الوقت
      data.timeStart = Date.now();
      data.count = 1;
    } else {
      data.count++;
    }

    // التحقق من تجاوز الحد
    if (data.count >= num) {
      const moment = require("moment-timezone");
      const timeDate = moment.tz("Asia/Riyadh").format("DD/MM/YYYY HH:mm:ss");

      const userData = await Users.getData(senderID) || {};
      const threadInfo = (await Threads.getData(threadID)).threadInfo || {};
      const threadName = threadInfo.threadName || "مجموعة غير معروفة";

      const banInfo = {
        banned: true,
        reason: `إرسال ${num} أوامر خلال ${timee} ثانية`,
        dateAdded: timeDate
      };

      userData.data = userData.data || {};
      Object.assign(userData.data, banInfo);
      await Users.setData(senderID, userData);

      global.data.userBanned.set(senderID, {
        reason: banInfo.reason,
        dateAdded: timeDate
      });

      delete global.client.autoban[senderID]; // إعادة ضبط السبامر

      api.sendMessage(
        `🚫 تم حظر المستخدم!\n\n👤 الاسم: ${userData.name}\n🆔 ID: ${senderID}\n📛 السبب: ${banInfo.reason}\n🕒 الوقت: ${timeDate}`,
        threadID
      );

      for (const adminID of global.config.ADMINBOT) {
        api.sendMessage(
          `⚠️ تنبيه!\nتم حظر سبامر تلقائيًا\n\n👤 الاسم: ${userData.name}\n🆔 ID: ${senderID}\n📛 السبب: ${banInfo.reason}\n📍 من المجموعة: ${threadName} (${threadID})\n🕒 الوقت: ${timeDate}`,
          adminID
        );
      }
    }
  }
};
