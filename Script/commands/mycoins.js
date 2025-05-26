module.exports.config = {
	name: "رصيد",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "رصيدك او رصيد شخص بالطاغ",
	commandCategory: "economy",
	usages: "[طاغ]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"sotienbanthan": "رصيدك هو: %1$",
		"sotiennguoikhac": "رصيد %1  هو: %2$"
	},
	"en": {
		"sotienbanthan": "رصيدك هو: %1$",
		"sotiennguoikhac": "رصيد %1' هو: %2$."
	}
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
	const { threadID, messageID, senderID, mentions } = event;

	if (!args[0]) {
		const money = (await Currencies.getData(senderID)).money;
		return api.sendMessage(getText("sotienbanthan", money), threadID, messageID);
	}

	else if (Object.keys(event.mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var money = (await Currencies.getData(mention)).money;
		if (!money) money = 0;
		return api.sendMessage({
			body: getText("sotiennguoikhac", mentions[mention].replace(/\@/g, ""), money),
			mentions: [{
				tag: mentions[mention].replace(/\@/g, ""),
				id: mention
			}]
		}, threadID, messageID);
	}

	else return global.utils.throwError(this.config.name, threadID, messageID);
}
