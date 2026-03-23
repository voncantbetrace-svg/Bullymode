require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  Events 
} = require('discord.js');

const { TOKEN, CLIENT_ID, TEST_GUILD_ID } = process.env;
if (!TOKEN || !CLIENT_ID || !TEST_GUILD_ID) {
  console.error("ERROR: Missing TOKEN, CLIENT_ID, or TEST_GUILD_ID.");
  process.exit(1);
}

// ===== DEFINE COMMANDS =====
const commands = [
  new SlashCommandBuilder()
    .setName('arp')
    .setDescription('we sturdy'),

  new SlashCommandBuilder()
    .setName('flood')
    .setDescription('Send a message multiple times')
    .addStringOption(option =>
      option.setName('message')
            .setDescription('Message to send')
            .setRequired(true))
    .addIntegerOption(option =>
      option.setName('count')
            .setDescription('Number of times to send (1-16)'))
].map(cmd => cmd.toJSON());

// ===== REGISTER COMMANDS =====
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Clearing old guild commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
      { body: [] } // clear old commands
    );
    console.log('✅ Old guild commands cleared');

    console.log('🔄 Registering new guild commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
      { body: commands }
    );
    console.log('✅ Guild commands registered (instant)');

    console.log('🔄 Registering global commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Global commands registered (may take 1h)');

  } catch (err) {
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

// ===== READY EVENT =====
client.once(Events.ClientReady, () => {
  console.log(`🔥 Bot online as ${client.user.tag}`);
});

// ===== INTERACTIONS =====
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'arp') {
    await interaction.reply('we Sturdy!');
  }

  if (interaction.commandName === 'flood') {
    const message = interaction.options.getString('message');
    let count = interaction.options.getInteger('count') || 5;
    if (count > 16) count = 16;

    for (let i = 0; i < count; i++) {
      await interaction.channel.send(message);
    }

    await interaction.reply({ content: '✅ Flood complete', ephemeral: true });
  }
});

// ===== LOGIN =====
client.login(TOKEN);
