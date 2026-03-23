require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Discord bot code
client.once('ready', () => console.log(`${client.user.tag} is online!`));
client.login(process.env.TOKEN);

// Tiny web server to satisfy Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
const { 
  Client, 
  GatewayIntentBits, 
  Events, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== SLASH COMMAND SETUP =====
const commands = [
  new SlashCommandBuilder()
    .setName('bullymode')
    .setDescription('Activate BullyMode 😈'),
    
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if bot is alive')
].map(cmd => cmd.toJSON());

// Register commands (auto deploy)
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 Registering commands...');
    await rest.put(
      Routes.applicationCommands('1481692205276987472'),
      { body: commands }
    );
    console.log('✅ Commands registered');
  } catch (err) {
    console.error(err);
  }
})();

// ===== BOT READY =====
client.once(Events.ClientReady, () => {
  console.log(`🔥 BullyMode is online as ${client.user.tag}`);
});

// ===== INTERACTIONS =====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'bullymode') {
    await interaction.reply('😈 BullyMode Activated');
  }
});

// ===== LOGIN =====
client.login(process.env.TOKEN);