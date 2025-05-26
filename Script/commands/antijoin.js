module.exports.config = {
    name: "قفل",
    version: "1.0.0",
    credits: "يونو",
    hasPermssion: 1,
    description: "تفعيل أو إيقاف خاصية منع الانضمام",
    usages: "antijoin on/off",
    commandCategory: "النظام",
    cooldowns: 0
};

module.exports.run = async({ api, event, Threads}) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('🛑 [ منع الانضمام ] ➤ يجب أن أكون أدمن في المجموعة عشان أقدر أشتغل! أضفني أدمن وجرب ثاني.', event.threadID, event.messageID);
    
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data.newMember == "undefined" || data.newMember == false) data.newMember = true;
    else data.newMember = false;

    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);

    return api.sendMessage(
        `${data.newMember == true ? "✅ تم تفعيل" : "❌ تم إيقاف"} خاصية *منع الانضمام* بنجاح! 
استمتعوا بالمجموعة بأمان أكثر! 🌟`,
        event.threadID, event.messageID
    );
}
