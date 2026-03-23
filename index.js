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

  // ===== ROTATING STATUSES =====
  const statuses = [
    { name: 'BullyMode 😈', type: 0 },          // Playing
    { name: 'With your messages 💬', type: 2 },  // Listening
    { name: 'The server chaos 😎', type: 3 },    // Watching
    { name: 'Competitive mode ⚔️', type: 5 }    // Competing
  ];

  let i = 0;
  setInterval(() => {
    const status = statuses[i];
    client.user.setPresence({
      activities: [status],
      status: 'online'
    });
    i = (i + 1) % statuses.length; // loop back to start
    console.log(`🎮 Status updated to: ${status.name}`);
  }, 10000); // change every 10 seconds
});

// ===== INTERACTIONS =====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'Arp') {
    await interaction.reply('Hit Yo 🧠!');
  }

  if (interaction.commandName === 'bullymode') {
    await interaction.reply('😈 BullyMode Activated');
  }
});

// ===== LOGIN =====
client.login(process.env.TOKEN);