module.exports.config = {
  name: "ايموجيات",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "يونو (تعديل: طلب المستخدم)",
  description: "لعبة تخمين الإيموجي",
  commandCategory: "ألعاب",
  usages: "ايموجيات",
  cooldowns: 5
};

const emojiList = [
  { emoji: "🍎", name: "تفاحة" },
  { emoji: "⚽", name: "كرة" },
  { emoji: "🚗", name: "سيارة" },
  { emoji: "❤️", name: "قلب" },
  { emoji: "✈️", name: "طائرة" },
  { emoji: "🐧", name: "بطريق" },
  { emoji: "🍕", name: "بيتزا" },
  { emoji: "🌙", name: "هلال" },
  { emoji: "☕", name: "شاي" },
  { emoji: "⚡", name: "برق" }
];

let currentAnswer = null;

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  currentAnswer = randomEmoji.name;

  api.sendMessage(
    `❓ خمن اسم هذا الإيموجي بالعربية:\n${randomEmoji.emoji}`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        threadID,
        type: "guess"
      });
    }
  );
};

module.exports.handleReply = async function({ api, event, handleReply, Currencies }) {
  const { body, senderID, threadID } = event;

  if (handleReply.type === "guess") {
    if (!currentAnswer) return;

    if (body.trim() === currentAnswer) {
      const reward = Math.floor(Math.random() * 91) + 10; // بين 10 و 100
      await Currencies.increaseMoney(senderID, reward);
      api.sendMessage(
        `✅ مبروك! "${body}" هو الجواب الصحيح!\nالفائز: ${senderID}\nربحت: ${reward}$!`,
        threadID
      );
      currentAnswer = null;
    }
  }
};
