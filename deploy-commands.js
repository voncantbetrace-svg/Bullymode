require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  Events, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("ERROR: Missing TOKEN, CLIENT_ID, or GUILD_ID.");
  process.exit(1);
}

// ===== SLASH COMMANDS =====
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
    .setName('Arp')
    .setDescription('Im sturdy')
].map(cmd => cmd.toJSON());

// Register commands
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('🔄 Registering commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Commands registered!');
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
    { name: 'Yo Bitch Love Me', type: 0 },     // Playing
    { name: 'Tell yo ho stop textin me', type: 2 },       // Listening
    { name: 'Back Ina Movie', type: 3 },          // Watching
    { name: 'Come Die', type: 5 }        // Competing
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

  if (interaction.commandName === 'Arp') {
    await interaction.reply('We Sturdy!');
  }

  if (interaction.commandName === 'flood') {
    const message = interaction.options.getString('message');
    let count = interaction.options.getInteger('count') || 5; // default 5
    if (count > 16) count = 16; // max 16

    for (let i = 0; i < count; i++) {
      await interaction.channel.send(message);
    }

    await interaction.reply(`ONG THIS SERVER ASS`);
  }
});

// ===== LOGIN =====
client.login(TOKEN);