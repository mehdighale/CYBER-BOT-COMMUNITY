module.exports.config = {
  name: "سرقة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "سرقة فلوس من أعضاء المجموعة (بحذر!)",
  commandCategory: "الاقتصاد",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users, Currencies }) {
  var alluser = global.data.allUserID;
  let victim = alluser[Math.floor(Math.random() * alluser.length)];
  let nameVictim = (await Users.getData(victim)).name;

  // منع سرقة نفس الشخص أو البوت نفسه
  if (victim == api.getCurrentUserID() && event.senderID == victim) 
    return api.sendMessage('لا تقدر تسرق مني، حاول حدا ثاني!', event.threadID, event.messageID);

  var route = Math.floor(Math.random() * 2);

  if (route > 1 || route == 0) {
    const moneydb = (await Currencies.getData(victim)).money;
    var money = Math.floor(Math.random() * 1000) + 1;

    if (!moneydb || moneydb <= 0) 
      return api.sendMessage(`يا ساتر! ${nameVictim} مفلس ما عنده فلوس تسرقها.`, event.threadID, event.messageID);

    else if (moneydb >= money) 
      return api.sendMessage(`واو! سرقت ${money}$ من جيب ${nameVictim} في هذه المجموعة! 💰`, event.threadID, async () => {
        await Currencies.increaseMoney(victim, -money);
        await Currencies.increaseMoney(event.senderID, money);
      }, event.messageID);

    else if (moneydb < money) 
      return api.sendMessage(`سرقت كل فلوس ${nameVictim} اللي هي ${moneydb}$! الحظ حليفك اليوم! 🎉`, event.threadID, async () => {
        await Currencies.increaseMoney(victim, -moneydb);
        await Currencies.increaseMoney(event.senderID, moneydb);
      }, event.messageID);
  } 
  else if (route == 1) {
    var name = (await Users.getData(event.senderID)).name;
    var moneyuser = (await Currencies.getData(event.senderID)).money;

    if (!moneyuser || moneyuser <= 0) 
      return api.sendMessage("ما عندك فلوس تخسرها! اشتغل واشتغل! 💼", event.threadID, event.messageID);

    else 
      return api.sendMessage(`أوه لا! تم القبض عليك وخسرت كل فلوسك اللي هي ${moneyuser}$! 😱`, event.threadID, () => 
        api.sendMessage({
          body: `مبروك لك يا ${nameVictim}! قبضت على ${name} وأخذت نصف فلوسه اللي هي ${Math.floor(moneyuser / 2)}$ كمكافأة! 🏆`,
          mentions: [
            { tag: nameVictim, id: victim }, 
            { tag: name, id: event.senderID }
          ]
        }, event.threadID, async () => {
          await Currencies.increaseMoney(event.senderID, -moneyuser);
          await Currencies.increaseMoney(victim, Math.floor(moneyuser / 2));
        }), event.messageID);
  }
}
