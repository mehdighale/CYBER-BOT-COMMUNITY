const fs = require("fs");

module.exports.config = {
  name: "اعلام",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "لعبة تخمين اسم الدولة من العلم مع نقاط وقائمة متصدرين",
  commandCategory: "ألعاب",
  usages: "اعلام",
  cooldowns: 5
};

const flagsList = [
  { emoji: "🇸🇦", name: "السعودية" },
  { emoji: "🇪🇬", name: "مصر" },
  { emoji: "🇸🇾", name: "سوريا" },
  { emoji: "🇲🇰", name: "مقدونيا" },
   { emoji: "🇰🇪", name: "كينيا" },
  { emoji: "🇸🇴", name: "الصومال" },
  { emoji: "🇸🇾", name: "سوريا" },
  { emoji: "🇧🇷", name: "البرازيل" },
  { emoji: "🇮🇶", name: "العراق" },
  { emoji: "🇱🇧", name: "لبنان" },
  { emoji: "🇲🇦", name: "المغرب" },
  { emoji: "🇩🇿", name: "الجزائر" },
  { emoji: "🇹🇳", name: "تونس" },
  { emoji: "🇰🇼", name: "الكويت" },
  { emoji: "🇶🇦", name: "قطر" },
  { emoji: "🇦🇪", name: "الإمارات" },
  { emoji: "🇴🇲", name: "عمان" },
  { emoji: "🇾🇪", name: "اليمن" },
  { emoji: "🇯🇴", name: "الأردن" },
  { emoji: "🇹🇷", name: "تركيا" },
  { emoji: "🇵🇸", name: "فلسطين" },
  { emoji: "🇯🇵", name: "اليابان" },
  { emoji: "🇨🇳", name: "الصين" },
  { emoji: "🇺🇸", name: "أمريكا" },
  { emoji: "🇬🇧", name: "بريطانيا" },
  { emoji: "🇫🇷", name: "فرنسا" },
  { emoji: "🇧🇷", name: "البرازيل" },
  { emoji: "🇷🇺", name: "روسيا" },
  { emoji: "🇮🇳", name: "الهند" },
  { emoji: "🇰🇷", name: "كوريا الجنوبية" }
];

let currentAnswer = null;
const scoreFile = __dirname + "/flag_scores.json";

// قراءة النقاط من الملف
function loadScores() {
  try {
    return JSON.parse(fs.readFileSync(scoreFile));
  } catch (e) {
    return {};
  }
}

// حفظ النقاط في الملف
function saveScores(scores) {
  fs.writeFileSync(scoreFile, JSON.stringify(scores, null, 2));
}

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const randomFlag = flagsList[Math.floor(Math.random() * flagsList.length)];
  currentAnswer = randomFlag.name;

  api.sendMessage(
    `🌍 خمن اسم الدولة من العلم التالي:\n${randomFlag.emoji}`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID,
        threadID,
        answer: currentAnswer,
        type: "guess"
      });
    }
  );
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { body, senderID, threadID } = event;
  const userAnswer = body.trim();

  if (handleReply.type === "guess") {
    if (userAnswer === handleReply.answer) {
      const scores = loadScores();
      scores[senderID] = (scores[senderID] || 0) + 1;
      saveScores(scores);

      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID]?.name || "مستخدم";

      api.sendMessage(
        `✅ صحيح! ${userAnswer} هي الإجابة!\nالفائز: ${userName}\nعدد نقاطك الآن: ${scores[senderID]}`,
        threadID
      );
    } else {
      api.sendMessage(`❌ إجابة خاطئة. حاول مرة أخرى.`, threadID);
    }
  }
};

// عرض المتصدرين (استخدم الأمر: اعلام قائمة)
module.exports.languages = {
  "ar": {
    "leaderboard": "قائمة المتصدرين"
  }
};

module.exports.onLoad = () => {
  if (!fs.existsSync(scoreFile)) {
    fs.writeFileSync(scoreFile, "{}");
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const { body, threadID, messageID } = event;

  if (body?.toLowerCase() === "اعلام قائمة") {
    const scores = loadScores();
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const ids = sorted.map(([id]) => id);

    api.getUserInfo(ids, (err, info) => {
      if (err) return api.sendMessage("حدث خطأ أثناء جلب المتصدرين.", threadID, messageID);

      const msg = sorted.map(([id, score], i) => {
        const name = info[id]?.name || `ID: ${id}`;
        return `${i + 1}. ${name} - ${score} نقطة`;
      }).join("\n");

      api.sendMessage(`🏆 قائمة المتصدرين:\n\n${msg}`, threadID, messageID);
    });
  }
};
