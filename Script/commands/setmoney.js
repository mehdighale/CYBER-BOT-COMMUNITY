module.exports.config = {
  name: "محفظتي",
  version: "0.0.1",
  hasPermssion: 2,
  credits: "يونو الحشاش",
  description: "تتحكم في الرصيد زي ما تتحكم في مودك وانت سهران",
  commandCategory: "الفلوس والهبال",
  usages: "محفظتي [منشن] [المبلغ]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  var mention = Object.keys(event.mentions)[0];
  var prefix = ";"
  var { body } = event;
  var content = body.slice(prefix.length + 8, body.length);
  var sender = content.slice(0, content.lastIndexOf(" "));
  var moneySet = content.substring(content.lastIndexOf(" ") + 1);

  if (args[0] == 'انا') {
    return api.sendMessage(
      `✨ تم تعبئة جيبك بـ ${moneySet} عملة.. دلع يا نجم!`,
      event.threadID,
      () => Currencies.increaseMoney(event.senderID, parseInt(moneySet)),
      event.messageID
    );
  }

  else if (args[0] == "مسح") {
    if (args[1] == 'انا') {
      const moneyme = (await Currencies.getData(event.senderID)).money;
      return api.sendMessage(
        `🚮 تم تفريغ جيبك يا ناصح!\n💸 راحت عليك: ${moneyme} عملة. ابكي براحتك.`,
        event.threadID,
        async () => await Currencies.decreaseMoney(event.senderID, parseInt(moneyme)),
        event.messageID
      );
    } else if (Object.keys(event.mentions).length == 1) {
      const moneydel = (await Currencies.getData(mention)).money;
      return api.sendMessage(
        `👻 تم سحب فلوس ${event.mentions[mention].replace("@", "")}، شكله خسر الرهان.\n💸 المبلغ الطاير: ${moneydel} عملة.`,
        event.threadID,
        async () => await Currencies.decreaseMoney(mention, parseInt(moneydel)),
        event.messageID
      );
    } else {
      return api.sendMessage("❗غلط يا باشا، تأكد من الطريقة، ولا تفشلنا.", event.threadID, event.messageID);
    }
  }

  else if (Object.keys(event.mentions).length == 1) {
    return api.sendMessage({
      body: `💸 تم تزويد ${event.mentions[mention].replace("@", "")} بـ ${moneySet} عملة. عازمنا ولا؟`,
      mentions: [{
        tag: event.mentions[mention].replace("@", ""),
        id: mention
      }]
    },
      event.threadID,
      async () => Currencies.increaseMoney(mention, parseInt(moneySet)),
      event.messageID
    );
  }

  else if (args[0] == "UID") {
    var id = args[1];
    var cut = args[2];
    let nameeee = (await Users.getData(id)).name;
    return api.sendMessage(
      `🤑 تم تعديل رصيد ${nameeee} إلى ${cut} عملة... فلوس جاية من السماء!`,
      event.threadID,
      () => Currencies.increaseMoney(id, parseInt(cut)),
      event.messageID
    );
  }

  else {
    return api.sendMessage("❗الصيغة مش تمام، يمكن انت اللي مش تمام؟ جرب مرة ثانية.", event.threadID, event.messageID);
  }
};
