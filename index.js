require('dotenv').config();
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
      Routes.applicationCommands('YOUR_CLIENT_ID'),
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