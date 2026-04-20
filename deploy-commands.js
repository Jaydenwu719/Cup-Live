require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// 🔐 SAFE: token from environment (NOT hardcoded)
const TOKEN = process.env.TOKEN;

// 👉 your bot client + app ID
const CLIENT_ID = "1495186140435710032";

// 🌐 slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start CUP LIVE match')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('Game name')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('score')
    .setDescription('Give points to a player')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Player')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('points')
        .setDescription('Points to add')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('end')
    .setDescription('End current round')
].map(cmd => cmd.toJSON());

// 🚀 deploy commands
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log("🚀 Deploying slash commands...");

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Commands deployed successfully!");
  } catch (error) {
    console.error(error);
  }
})();