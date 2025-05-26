module.exports.config = {
  name: "حب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "احسب نسبة الحب بينك وبين شخص آخر (يكلف 200 نقطة)",
  commandCategory: "تسلية",
  usages: "حب [@الاسم]",
  cooldowns: 3,
};

module.exports.run = async function({ api, event, Currencies }) {
  const { threadID, senderID, mentions, messageID } = event;

  // التحقق من الرصيد
  const userData = await Currencies.getData(senderID) || {};
  const money = userData.money || 0;

  if (money < 200) {
    return api.sendMessage("❌ تحتاج إلى 200 نقطة لاستخدام هذا الأمر.", threadID, messageID);
  }

  // خصم النقاط
  await Currencies.decreaseMoney(senderID, 200);

  let name1 = "", name2 = "", id1 = senderID, id2 = "";

  if (Object.keys(mentions).length === 1) {
    id2 = Object.keys(mentions)[0];
    name1 = (await api.getUserInfo(id1))[id1].name;
    name2 = mentions[id2].replace(/@/g, "");
  } else {
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.participantIDs.filter(id => id !== senderID);
    id2 = members[Math.floor(Math.random() * members.length)];
    name1 = (await api.getUserInfo(id1))[id1].name;
    name2 = (await api.getUserInfo(id2))[id2].name;
  }

  const lovePercent = Math.floor(Math.random() * 101); // 0 - 100
  let comment = "";

  if (lovePercent >= 90) comment = "أنتم توأم روح حقيقي!";
  else if (lovePercent >= 70) comment = "حب قوي ومتين!";
  else if (lovePercent >= 50) comment = "في أمل كبير!";
  else if (lovePercent >= 30) comment = "فيه مشاعر خفيفة!";
  else comment = "الحب ضعيف... لكن كل شيء ممكن!";

  const msg = `❤️ نسمة الحب بين ${name1} و ${name2} هي: ${lovePercent}%\n\n${comment}\n\n- تم خصم 200 نقطة.`;
  return api.sendMessage(msg, threadID, messageID);
};
