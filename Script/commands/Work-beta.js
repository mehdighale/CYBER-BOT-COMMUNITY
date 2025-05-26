module.exports.config = {
    name: "عمل",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "يونو", 
    description: "مركز الوظائف لتربح كوينز بطريقة ممتعة",
    commandCategory: "اقتصاد",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 7200000 // ساعتين
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "هدوء يا بطل! تعال بعد %1 دقيقة و %2 ثانية."
    }
};

module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};

    // أرباح عشوائية لكل وظيفة
    var coinsIndustry = Math.floor(Math.random() * 401) + 200;
    var coinsService = Math.floor(Math.random() * 801) + 200;
    var coinsOil = Math.floor(Math.random() * 401) + 200;
    var coinsOre = Math.floor(Math.random() * 601) + 200;
    var coinsDigRock = Math.floor(Math.random() * 201) + 200;
    var coinsDigRockVIP = Math.floor(Math.random() * 801) + 200;
    var coinsDZ = Math.floor(Math.random() * 601) + 200;

    // المهام
    var industryJobs = ['توظيف الموظفين', 'مدير فندق', 'في محطة الكهرباء', 'شيف مطعم', 'عامل مصنع'];
    var serviceJobs = ['سباك', 'تصليح مكيفات الجيران', 'مندوب مبيعات', 'توزيع منشورات', 'سائق شحن', 'تصليح كمبيوتر', 'مرشد سياحي', 'مساعد رضاعة']; 
    var oilJobs = ['جمع 13 برميل نفط', 'جمع 8 براميل نفط', 'سرقة النفط', 'صب ماء في النفط وبيعه'];
    var oreJobs = ['خام حديد', 'خام ذهب', 'خام فحم', 'خام رصاص', 'خام نحاس', 'خام نفط'];
    var digRockJobs = ['ألماس', 'ذهب', 'فحم', 'زمرد', 'حديد', 'حجر عادي', 'كسول', 'حجر أزرق'];
    var digRockVIPJobs = ['ضيف VIP', 'براءة اختراع', 'غريب', 'شاب عمره 23', 'ممول', 'رجل أعمال عمره 92', 'صبي عمره 12', 'رقاصة في التيك توك'];
    var dzJobs = ['بائع زلابية في بوفاريك', 'بائع دجاج في ولاد فايت', 'موال في الجلفة', 'سراق في الحراش'];

    // اختيار المهام
    var job1 = industryJobs[Math.floor(Math.random() * industryJobs.length)];
    var job2 = serviceJobs[Math.floor(Math.random() * serviceJobs.length)];
    var job3 = oilJobs[Math.floor(Math.random() * oilJobs.length)];
    var job4 = oreJobs[Math.floor(Math.random() * oreJobs.length)];
    var job5 = digRockJobs[Math.floor(Math.random() * digRockJobs.length)];
    var job6 = digRockVIPJobs[Math.floor(Math.random() * digRockVIPJobs.length)];
    var job8 = dzJobs[Math.floor(Math.random() * dzJobs.length)];

    var msg = "";
    switch (handleReply.type) {
        case "choosee": {
            switch (event.body) {
                case "1": 
                    msg = `⚡️ اشتغلت ${job1} في المنطقة الصناعية وربحت ${coinsIndustry}$! شغل ممتاز!`; 
                    await Currencies.increaseMoney(senderID, coinsIndustry); 
                    break;             
                case "2": 
                    msg = `⚡️ اشتغلت ${job2} في خدمات المجتمع وربحت ${coinsService}$! عمل رائع!`; 
                    await Currencies.increaseMoney(senderID, coinsService); 
                    break;
                case "3": 
                    msg = `⚡️ انت تعمل ${job3} في حقل النفط وربحت ${coinsOil}$! دهب من البترول!`; 
                    await Currencies.increaseMoney(senderID, coinsOil); 
                    break;
                case "4": 
                    msg = `⚡️ تستخرج ${job4} من المناجم وربحت ${coinsOre}$! كنز ثمين!`; 
                    await Currencies.increaseMoney(senderID, coinsOre); 
                    break;
                case "5": 
                    msg = `⚡️ بدأت تحفر ${job5} وربحت ${coinsDigRock}$! حفار محترف!`; 
                    await Currencies.increaseMoney(senderID, coinsDigRock); 
                    break;
                case "6": 
                    msg = `⚡️ اخترت ${job6} وربحت ${coinsDigRockVIP}$! يا سلام على الحظ!`; 
                    await Currencies.increaseMoney(senderID, coinsDigRockVIP); 
                    break;
                case "7": 
                    msg = "⚡️ قريبًا... مفاجآت جديدة!"; 
                    break;
                case "8":
                    msg = `⚡️ اشتغلت ${job8} وربحت ${coinsDZ}$! خدمة جزائرية أصيلة!`;
                    await Currencies.increaseMoney(senderID, coinsDZ); 
                    break;
                default: 
                    return api.sendMessage("⚡️ الرجاء إدخال رقم صحيح من القائمة.", threadID, messageID);
            }

            const choice = parseInt(event.body);
            if (isNaN(choice)) return api.sendMessage("⚡️ الرجاء إدخال رقم فقط!", threadID, messageID);
            if (choice < 1 || choice > 8) return api.sendMessage("⚡️ الخيار غير موجود في القائمة.", threadID, messageID);

            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`${msg}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
    }
};

module.exports.run = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        var time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    } else {    
        return api.sendMessage(
`مرحباً بك في مركز الوظائف لكسب الكوينز 💰
اختر وظيفتك بالرقم:
1. العمل في المنطقة الصناعية 🏭
2. خدمات المجتمع 🛠️
3. العمل في حقل النفط 🛢️
4. استخراج خامات المناجم ⛏️
5. حفر الصخور 💎
6. عمل خاص VIP ✨
7. تحديثات قادمة...
8. عمل في الجزائر 🇩🇿`,
        threadID, (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        });
    }
};
