module.exports.config = {
  name: "منع",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "يونو",
  description: "يمنع تغيير اسم وصورة المجموعة",
  commandCategory: "إدارة",
  usages: "منع | فتح",
  cooldowns: 5,
  eventType: ["log:thread-name", "log:thread-icon"]
};

let lockedThreads = {};

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  const command = args[0];

  if (command === "فتح") {
    if (lockedThreads[threadID]) {
      delete lockedThreads[threadID];
      return api.sendMessage("✨ تم رفع المنع عن تغيير اسم وصورة المجموعة، صارلكم الحرية تلعبوا براحتكم! 💖", threadID);
    } else {
      return api.sendMessage("❌ لا يوجد منع مفعل على هذه المجموعة.", threadID);
    }
  }

  if (command === "منع" || !command) {
    const threadInfo = await api.getThreadInfo(threadID);
    lockedThreads[threadID] = {
      name: threadInfo.threadName,
      image: threadInfo.imageSrc || null
    };

    return api.sendMessage("✨ تم منع تغيير اسم وصورة المجموعة، لا تغيروا الاسم أو الصورة بدون إذني! 👀💕", threadID);
  }

  return api.sendMessage("❓ الأمر غير معروف. استخدم:\n- منع\n- فتح", threadID);
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType } = event;

  if (!lockedThreads[threadID]) return;

  if (logMessageType === "log:thread-name") {
    console.log(`[منع] اكتشف تغيير اسم في المجموعة ${threadID}`);
    const oldName = lockedThreads[threadID].name;
    if (oldName) {
      try {
        await api.changeGroupName(oldName, threadID);
        api.sendMessage("🙅‍♀️ لا تغيروا اسم المجموعة! لقد عدت الاسم القديم بحنية 💖", threadID);
      } catch (error) {
        console.error("خطأ في إعادة اسم المجموعة:", error);
      }
    }
  }

  if (logMessageType === "log:thread-icon") {
    console.log(`[منع] اكتشف تغيير صورة في المجموعة ${threadID}`);
    const oldImage = lockedThreads[threadID].image;
    if (oldImage) {
      try {
        await api.changeGroupImage(oldImage, threadID);
        api.sendMessage("🖼️ صورتكم رجعت روعة مثل القمر، ولا تفكروا تغيّروا بدون استشارتي، يا أجمل ناس! 🌙✨", threadID);
      } catch (error) {
        console.error("خطأ في إعادة صورة المجموعة:", error);
      }
    }
  }
};
