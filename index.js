require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  Events, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

const OWNER_ID = '291215718106791936';
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// ✅ Check environment variables
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("ERROR: Missing TOKEN, CLIENT_ID, or GUILD_ID.");
  process.exit(1);
}

// ===== REGISTER COMMANDS =====
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
    .setName('ping')
    .setDescription('Check if bot is alive')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Commands registered!');
  } catch (err) {
    console.error('❌ Failed to register commands. Check TOKEN, CLIENT_ID, GUILD_ID:');
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
  console.log('Guilds this bot is in:');
  client.guilds.cache.forEach(g => console.log(g.id, g.name));

  const statuses = [
    { name: 'Bully Taking Over', type: 0 },     // Playing
    { name: 'Textin Yo Ho', type: 2 },       // Listening
    { name: 'You a bitch nigga', type: 3 },          // Watching
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
  }, 10000); // rotate every 10 seconds
});

// ===== INTERACTIONS =====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // Only allow owner
  if (interaction.user.id !== OWNER_ID) {
    return interaction.reply({ content: "You are not allowed to use this bot.", ephemeral: true });
  }

  try {
    if (interaction.commandName === 'Arp ') {
      await interaction.reply('Onna 2man Gtfo!');
    }

    if (interaction.commandName === 'flood') {
      const message = interaction.options.getString('message');
      let count = interaction.options.getInteger('count') || 1;

      if (count > 16) count = 16;
      if (count < 1) count = 1;

      for (let i = 0; i < count; i++) {
        await interaction.channel.send(`${message} [Bully]`);
      }

      await interaction.reply({ content: `✅ Sent message ${count} times!`, ephemeral: true });
    }
  } catch (err) {
    console.error("Error handling interaction:", err);
    if (!interaction.replied) {
      await interaction.reply({ content: "Something went wrong!", ephemeral: true });
    }
  }
});

// ===== LOGIN =====
client.login(TOKEN).catch(err => {
  console.error("Login failed. Check your TOKEN:", err);
  process.exit(1);
});