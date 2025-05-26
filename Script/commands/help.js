module.exports.config = {
    name: "اوامر",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "قائمة اوامر البوت",
    commandCategory: "النظام",
    usages: "[اوامر]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "╭──────•◈•──────╮\n |      YUNA BOT \n |●الاسم: •—» %1 «—•\n |●الاستعمال: %3\n |●الشرح: %2\n |●الفئة: %4\n |●وقت الانتظار: %5 seconds(s)\n |●𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6\n |بواسطة\n |•YUNO•\n╰──────•◈•──────╯",
        "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
        "user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
    }
};

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
    if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};

module.exports.run = function({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (args[0] == "all") {
        const commandValues = commands.values();
        var group = [], msg = "";
        for (const commandConfig of commandValues) {
            if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()))
                group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
            else
                group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
        }
        group.forEach(commandGroup => msg += `❄️ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(' • ')}\n\n`);

        return api.sendMessage(`✿قاائمة الاوامر الجميلة 💖\n\n${msg}✿══════════════✿\n│𝗨𝘀𝗲 ${prefix}help [Name?]\n│𝗨𝘀𝗲 ${prefix}help [Page?]\n│\n│اجمالي الاوامر :  ${commands.size}\n————————————`, threadID, messageID);
    }

    if (!command) {
        const arrayInfo = [];
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 15;
        let msg = "";

        for (var [name] of commands) {
            arrayInfo.push(name);
        }

        arrayInfo.sort();
        const first = numberOfOnePage * page - numberOfOnePage;
        const helpView = arrayInfo.slice(first, first + numberOfOnePage);

        for (let cmds of helpView) msg += `•—»[ ${cmds} ]«—•\n`;

        const text = `╭──────•◈•──────╮\n│استعمل ${prefix}اوامر [Name?]\n│استعمل${prefix}اوامر[Page?]\n│المطور : YUNO \n│اجمالي الاوامر : [${arrayInfo.length}]\n│📛🄿🄰🄶🄴📛 :  [${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}]\n╰──────•◈•──────╯`;

        return api.sendMessage(`╭──────•◈•──────╮\n |        YUNA BOT \n |   🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃       \n╰──────•◈•──────╯\n\n${msg}\n${text}`, threadID, messageID);
    }

    const leiamname = getText("moduleInfo", command.config.name, command.config.description, `${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits);

    return api.sendMessage(leiamname, threadID, messageID);
};
