import { readdirSync, unlinkSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const keepFiles = [
  "Oout.js",
  "acp.js", "adduser.js", "ai.js", "antijoin.js", "antiout.js", "couple.js",
  "help.js",
  "love.js", "marry.js", "music.js", "mycoins.js", "Offbot.js", "out.js",
  "pic.js", "rip.js", "setmoney.js", "slap.js", "slot.js",
  "spamban.js", "steal.js", "uid.js", "unsend.js", "Work-beta.js",
];

const mustCreateFiles = [
  "0save.js", "0quiz.js", "0salat.js", "0rc.js",
  "game1contry.js", "game2words.js", "game3q.js", "yunaa.js", "Oazkar.js", "Omath.js",
];

const directory = ".";

const files = readdirSync(directory);

for (const file of files) {
  if (file.endsWith(".js")) {
    if (!keepFiles.includes(file) && !mustCreateFiles.includes(file)) {
      unlinkSync(join(directory, file));
      console.log(`Deleted file: ${file}`);
    }
  }
}

for (const file of mustCreateFiles) {
  const filePath = join(directory, file);
  if (!existsSync(filePath)) {
    writeFileSync(filePath, "");
    console.log(`Created missing file: ${file}`);
  }
}
