const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// 🌍 YOUR HOSTED SERVER (Render)
const API = "https://cup-live.onrender.com";

// 🔐 TOKEN COMES FROM ENV (NOT CODE)
const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🏆 CUP STATE
let cup = {
  game: "none",
  round: 1,
  scores: {}
};

// 🔐 Admin / Ref check
function isRef(member) {
  return member.permissions.has("Administrator") ||
         member.permissions.has("ManageGuild");
}

// 📡 Sync to Render server
async function sync() {
  try {
    await axios.post(`${API}/update`, cup);
    console.log("SYNC OK");
  } catch (err) {
    console.log("SYNC ERROR:", err.message);
  }
}

// ================= COMMANDS =================
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  // 🎮 START GAME
  if (i.commandName === 'start') {

    if (!isRef(i.member))
      return i.reply({ content: "Ref only", ephemeral: true });

    cup.game = i.options.getString('game');

    await sync();

    return i.reply(`🏆 CUP LIVE started: ${cup.game}`);
  }

  // 🏆 SCORE COMMAND
  if (i.commandName === 'score') {

    if (!isRef(i.member))
      return i.reply({ content: "Ref only", ephemeral: true });

    const user = i.options.getUser('user');
    const pts = i.options.getInteger('points');

    if (!cup.scores[user.id]) {
      cup.scores[user.id] = {
        name: user.username,
        points: 0
      };
    }

    cup.scores[user.id].points += pts;

    await sync();

    return i.reply(`+${pts} → ${user.username}`);
  }

  // 🏁 END ROUND
  if (i.commandName === 'end') {
    cup.round++;
    await sync();
    return i.reply("🏁 Round ended");
  }
});

// 🤖 BOT READY
client.once('ready', () => {
  console.log(`🏆 CUP LIVE BOT ONLINE: ${client.user.tag}`);
});

// 🔐 LOGIN
client.login(TOKEN);