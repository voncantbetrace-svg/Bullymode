require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  Events, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

const { TOKEN, CLIENT_ID } = process.env;
if (!TOKEN || !CLIENT_ID) {
  console.error("ERROR: Missing TOKEN or CLIENT_ID.");
  process.exit(1);
}

// ===== GLOBAL SLASH COMMANDS =====
const commands = [
  new SlashCommandBuilder()
    .setName('flood')
    .setDescription('Send messages with Bully emblem')
    .addStringOption(option =>
      option.setName('message')
            .setDescription('Message to send')
            .setRequired(true))
    .addIntegerOption(option =>
      option.setName('count')
            .setDescription('Number of times to send (1-16)')),
  
  new SlashCommandBuilder()
    .setName('arp')
    .setDescription('we sturdy')
].map(cmd => cmd.toJSON());

// Register commands globally
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('🔄 Registering global commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID), // Global, works in all servers
      { body: commands }
    );
    console.log('✅ Global commands registered!');
    console.log('⚠️ Global commands may take up to 1 hour to appear in Discord');
  } catch (err) {
    console.error('❌ Failed to register commands:');
    console.error(err);
  }
})();

// ===== CREATE CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== BOT READY & ROTATING STATUS =====
client.once(Events.ClientReady, () => {
  console.log(`🔥 Bot is online as ${client.user.tag}`);

  const statuses = [
    { name: 'Yo Bitch Love Me', type: 0 }, // Playing
    { name: 'Tell yo ho stop textin me', type: 2 }, // Listening
    { name: 'Back Ina Movie', type: 3 }, // Watching
    { name: 'Come Die', type: 5 } // Competing
  ];

  let i = 0;
  setInterval(() => {
    const status = statuses[i];
    client.user.setPresence({
      activities: [status],
      status: 'online'
    });
    i = (i + 1) % statuses.length;
    console.log(`🎮 Status updated to: ${status.name}`);
  }, 10000); // rotates every 10 seconds
});

// ===== INTERACTIONS =====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // /arp command
  if (interaction.commandName === 'arp') {
    await interaction.reply('we Sturdy!');
  }

  // /flood command
  if (interaction.commandName === 'flood') {
    const message = interaction.options.getString('message');
    let count = interaction.options.getInteger('count') || 5;
    if (count > 16) count = 16;

    for (let i = 0; i < count; i++) {
      await interaction.channel.send(message);
    }

    // ephemeral reply so only the command user sees confirmation
    await interaction.reply({ content: '✅ Flood complete', ephemeral: true });
  }
});

// ===== LOGIN =====
client.login(TOKEN);