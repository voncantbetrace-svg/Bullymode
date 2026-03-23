require('dotenv').config();
const { REST, Routes } = require('discord.js');

const { TOKEN, CLIENT_ID, 1483499696822550680 } = process.env;
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
      { body: [] } // ✅ deletes all commands in this guild
    );
    console.log('✅ Cleared all guild commands in server:', TEST_GUILD_ID);
  } catch (err) {
    console.error(err);
  }
})();