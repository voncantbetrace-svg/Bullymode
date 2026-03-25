require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [
  new SlashCommandBuilder()
    .setName('flood')
    .setDescription('Send messages with Bully emblem')
    .addStringOption(o => o.setName('message').setDescription('Message to send').setRequired(true))
    .addIntegerOption(o => o.setName('count').setDescription('Number of times to send (1-16)')),
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if bot is alive'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Commands registered!');
  } catch (err) {
    console.error(err);
  }
})();
