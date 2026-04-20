// 🌐 KEEP RENDER ALIVE (WEB SERVICE MODE)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🏆 CUP LIVE BOT RUNNING");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🌐 Web server active on port", PORT);
});

// ================= BOT CODE =================

require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// 🔐 SAFE TOKEN
const TOKEN = process.env.TOKEN;

// 🌍 YOUR API
const API = "https://cup-live.onrender.com";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🏆 CUP STATE
let cup = {
  game: "none",
  round: 1,
  scores: {}
};

// 🔐 ADMIN CHECK
function isRef(member) {
  return member.permissions.has("Administrator") ||
         member.permissions.has("ManageGuild");
}

// 📡 SYNC TO SERVER
async function sync() {
  try {
    await axios.post(`${API}/update`, cup);
    console.log("📡 SYNC OK");
  } catch (err) {
    console.log("❌ SYNC ERROR:", err.message);
  }
}

// ================= COMMAND HANDLER =================
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;

  // 🎮 START
  if (i.commandName === 'start') {

    if (!isRef(i.member))
      return i.reply({ content: "Ref only", ephemeral: true });

    cup.game = i.options.getString('game');
    cup.round = 1;
    cup.scores = {};

    await sync();

    return i.reply(`🏆 CUP LIVE started: ${cup.game}`);
  }

  // 🏆 SCORE
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

// 🤖 READY EVENT
client.once('ready', () => {
  console.log(`🤖 BOT ONLINE: ${client.user.tag}`);
});

// 🔐 LOGIN
client.login(TOKEN);