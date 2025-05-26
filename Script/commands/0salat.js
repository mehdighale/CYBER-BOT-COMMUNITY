const axios = require('axios');

module.exports.config = {
  name: "صلاة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "يونو",
  description: "يرسل مواقيت الصلاة حسب البلد",
  commandCategory: "معلومات",
  usages: "صلاة [اسم البلد]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  if (args.length === 0) {
    return api.sendMessage("يرجى كتابة اسم البلد بعد الأمر، مثل: صلاة الجزائر", threadID, messageID);
  }

  const country = args.join(" ");

  try {
    // نجيب بيانات المدينة والبلد عن طريق API بحث المواقع
    const geoRes = await axios.get(`https://api.aladhan.com/v1/cities/lookup?country=${encodeURIComponent(country)}`);
    if (!geoRes.data || !geoRes.data.data || geoRes.data.data.length === 0) {
      return api.sendMessage(`لم أتمكن من إيجاد بيانات بلد "${country}"، يرجى التأكد من الاسم.`, threadID, messageID);
    }

    // ناخذ أول مدينة للبلد اللي ادخلها المستخدم (لأنه API يحتاج مدينة للموقيت)
    const city = geoRes.data.data[0].city;

    // نجيب مواقيت الصلاة للمدينة والبلد
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const prayerRes = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`);

    if (!prayerRes.data || !prayerRes.data.data || !prayerRes.data.data.timings) {
      return api.sendMessage("تعذر جلب مواقيت الصلاة الآن، حاول لاحقًا.", threadID, messageID);
    }

    const timings = prayerRes.data.data.timings;

    const message = 
`مواقيت الصلاة اليوم في ${city}, ${country}:

الفجر: ${timings.Fajr}
الشروق: ${timings.Sunrise}
الظهر: ${timings.Dhuhr}
العصر: ${timings.Asr}
المغرب: ${timings.Maghrib}
العشاء: ${timings.Isha}`;

    return api.sendMessage(message, threadID, messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("حدث خطأ أثناء جلب مواقيت الصلاة، حاول مرة أخرى.", threadID, messageID);
  }
};
