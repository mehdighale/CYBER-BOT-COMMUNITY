module.exports.config = {
  name: "قبول",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "يونو",
  description: "قبول أو حذف طلبات الصداقة باستخدام معرف فيسبوك",
  commandCategory: "إدارة البوت",
  usages: "قبول",
  cooldowns: 0
};

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  if (author != event.senderID) return;

  const args = event.body.trim().toLowerCase().split(" ");

  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };

  const success = [];
  const failed = [];

  if (args[0] == "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
  } else if (args[0] == "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
  } else {
    return api.sendMessage("يرجى استخدام الصيغة التالية:\n[add | del] [الرقم أو all]", event.threadID, event.messageID);
  }

  let targetIDs = args.slice(1);
  if (args[1] == "all") {
    targetIDs = listRequest.map((_, idx) => idx + 1);
  }

  const newTargetIDs = [];
  const promiseFriends = [];

  for (const stt of targetIDs) {
    const u = listRequest[parseInt(stt) - 1];
    if (!u) {
      failed.push(`الرقم ${stt} غير موجود`);
      continue;
    }
    form.variables.input.friend_requester_id = u.node.id;
    form.variables = JSON.stringify(form.variables);
    newTargetIDs.push(u);
    promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
    form.variables = JSON.parse(form.variables);
  }

  for (let i = 0; i < newTargetIDs.length; i++) {
    try {
      const friendRequest = await promiseFriends[i];
      if (JSON.parse(friendRequest).errors) failed.push(newTargetIDs[i].node.name);
      else success.push(newTargetIDs[i].node.name);
    } catch (e) {
      failed.push(newTargetIDs[i].node.name);
    }
  }

  return api.sendMessage(
    `✨ تمت العملية بنجاح!\n\n` +
    `» ${args[0] == 'add' ? 'تم قبول' : 'تم حذف'} ${success.length} من طلبات الصداقة:\n${success.join("\n")}` +
    `${failed.length > 0 ? `\n\n❌ فشل مع ${failed.length}:\n${failed.join("\n")}` : ""}`,
    event.threadID,
    event.messageID
  );
};

module.exports.run = async ({ event, api }) => {
  const moment = require("moment-timezone");

  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;

  if (listRequest.length === 0) {
    return api.sendMessage("لا يوجد طلبات صداقة حالياً! ☺️", event.threadID, event.messageID);
  }

  let msg = "✉️ طلبات الصداقة الحالية:\n";
  let i = 0;
  for (const user of listRequest) {
    i++;
    msg += `\n${i}. الاسم: ${user.node.name}\nمعرّف: ${user.node.id}\nالرابط: ${user.node.url.replace("www.facebook", "fb")}\nالوقت: ${moment(user.time * 1009).tz("Asia/Baghdad").format("DD/MM/YYYY HH:mm:ss")}\n`;
  }

  msg += `\n\n» قم بالرد على هذه الرسالة بـ: [add | del] [رقم أو all] لاتخاذ الإجراء المطلوب.\nمثال: add 1 أو del all`;

  return api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      listRequest,
      author: event.senderID
    });
  }, event.messageID);
};
