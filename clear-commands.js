require('dotenv').config();
const { REST, Routes } = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Clearing guild commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
    console.log('Guild commands cleared!');

    console.log('Clearing global commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log('Global commands cleared!');
  } catch (err) {
    console.error(err);
  }
})();
