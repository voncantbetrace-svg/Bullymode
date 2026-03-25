require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');

const OWNER_ID = '291215718106791936';
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("ERROR: Missing TOKEN, CLIENT_ID, or GUILD_ID.");
  process.exit(1);
}

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
    console.error('Failed to register commands:', err);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, () => {
  console.log(`Bot is online as ${client.user.tag}`);
  const statuses = [
    { name: 'Bully Taking Over', type: 0 },
    { name: 'Textin Yo Ho', type: 2 },
    { name: 'You a bitch nigga', type: 3 },
    { name: 'Come Die', type: 5 },
  ];
  let i = 0;
  setInterval(() => {
    client.user.setPresence({ activities: [statuses[i]], status: 'online' });
    i = (i + 1) % statuses.length;
  }, 10000);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.user.id !== OWNER_ID) {
    return interaction.reply({ content: "You are not allowed to use this bot.", ephemeral: true });
  }
  try {
    if (interaction.commandName === 'ping') await interaction.reply('Bully is alive!');
    if (interaction.commandName === 'flood') {
      const message = interaction.options.getString('message');
      let count = interaction.options.getInteger('count') || 1;
      if (count > 16) count = 16;
      for (let j = 0; j < count; j++) await interaction.channel.send(`${message} [Bully]`);
      await interaction.reply({ content: `Sent message ${count} times!`, ephemeral: true });
    }
  } catch (err) {
    console.error(err);
    if (!interaction.replied) await interaction.reply({ content: "Something went wrong!", ephemeral: true });
  }
});

client.login(TOKEN).catch(err => { console.error("Login failed:", err); process.exit(1); });
