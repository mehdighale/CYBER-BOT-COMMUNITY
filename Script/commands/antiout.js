module.exports.config = {
    name: "ارجاع",
    version: "1.0.0",
    credits: "يونو",
    hasPermssion: 1,
    description: "تفعيل أو إيقاف خاصية منع الخروج",
    usages: "ارجاع on/off",
    commandCategory: "النظام",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    let data = (await Threads.getData(event.threadID)).data || {};

    if (typeof data["ارجاع"] == "undefined" || data["ارجاع"] == false) {
        data["ارجاع"] = true;
    } else {
        data["ارجاع"] = false;
    }

    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);

    return api.sendMessage(
        `${data["ارجاع"] == true
            ? "✅ واااو! خاصية *منع الخروج* مفعلة! 🚪❌ ما في مهرب من المجموعة! استمتعوا بالبقاء!"
            : "❌ تم تعطيل خاصية *منع الخروج*! الباب مفتوح والكل يقدر يروح وين ما يريد 🚪✨"
        }`,
        event.threadID
    );
};
