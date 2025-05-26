const fs = require("fs");

module.exports.config = {
  name: "الغاز",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "لعبة الألغاز مع قائمة متصدرين",
  commandCategory: "ألعاب",
  usages: "الغاز",
  cooldowns: 5
};

const riddles = [
  { question: "من فوق لوح ومن تحت لوح وفي النص روك", answer: "السلحفاة" },
  { question: "شيء له أوراق لكنه ليس نباتاً، وله جلد لكنه ليس حيواناً، وعلم لكنه ليس إنساناً؟", answer: "الكتاب" },
  { question: "أخت خالك وليست خالتك، فمن تكون؟", answer: "أمك" },
  { question: "ما الشيء الذي إذا أكل صدق وإذا جاع كذب؟", answer: "الساعة" },
  { question: "ما هو الشيء الذي كلما أخذت منه كبر؟", answer: "الحفرة" },
  { question: "ما هو الشيء الذي لا يمشي إلا بالضرب؟", answer: "المسمار" },
  { question: "له رقبة وليس له رأس، فما هو؟", answer: "الزجاجة" },
  { question: "ترى كل شيء وليس لها عيون، فما هي؟", answer: "المرآة" },
  { question: "شيء يكتب ولا يقرأ؟", answer: "القلم" },
  { question: "ما هو الشيء الذي يكسر ولا يسمع له صوت؟", answer: "الصمت" },
  { question: "أسود عندما تشتريه، أحمر عندما تستخدمه، رمادي عندما ترميه؟", answer: "الفحم" },
  { question: "ما هو الشيء الذي يسير بلا أرجل ولا يدخل إلا بالأذنين؟", answer: "الصوت" },
  { question: "ما هو الشيء الذي إذا وضعته في الثلاجة لا يبرد؟", answer: "الفلفل" },
  { question: "ما هو الشيء الذي لديه أسنان ولا يعض؟", answer: "المشط" },
  { question: "ما هو الشيء الذي يملك عيناً ولا يرى؟", answer: "الإبرة" }
];

let currentRiddle = null;
let currentAnswer = null;
const scoresFile = __dirname + "/riddle_scores.json";
let scores = fs.existsSync(scoresFile) ? JSON.parse(fs.readFileSync(scoresFile)) : {};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const random = riddles[Math.floor(Math.random() * riddles.length)];
  currentRiddle = random.question;
  currentAnswer = random.answer;

  api.sendMessage(
    `❓ لغز اليوم:\n${currentRiddle}`,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID,
        threadID,
        type: "guess"
      });
    }
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { body, threadID, senderID } = event;

  if (handleReply.type === "guess") {
    if (!currentAnswer) return;

    if (body.trim().toLowerCase() === currentAnswer.toLowerCase()) {
      scores[senderID] = (scores[senderID] || 0) + 1;
      fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));

      api.sendMessage(
        `✅ إجابة صحيحة! ${currentAnswer}\nلقد حصلت على نقطة!\nاكتب "الغاز قائمة" لعرض المتصدرين.`,
        threadID
      );

      currentAnswer = null;
    }
  }
};

module.exports.languages = { "ar": {} };

module.exports.onLoad = function () {
  if (!fs.existsSync(scoresFile)) fs.writeFileSync(scoresFile, "{}");
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID } = event;
  if (!body) return;

  if (body.toLowerCase() === "الغاز قائمة") {
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const ids = sorted.map(([id]) => id);
    const userInfo = await api.getUserInfo(ids);

    const leaderboard = sorted.map(([id, score], index) => {
      const name = userInfo[id]?.name || `ID: ${id}`;
      return `${index + 1}. ${name} - ${score} نقطة`;
    }).join('\n');

    api.sendMessage(`🏆 قائمة متصدري الألغاز:\n\n${leaderboard}`, threadID);
  }
};
