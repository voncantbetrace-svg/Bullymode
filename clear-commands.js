require('dotenv').config();
const { REST, Routes } = require('discord.js');

const { TOKEN, CLIENT_ID, TEST_GUILD_ID } = process.env; // ✅ use variable name
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    // Clear commands in a single guild
    await rest.put(
      Routes.applicationGuildCommands(1485448760296472767, 1483499696822550680),
      { body: [] } // deletes all commands in this guild
    );
    console.log('✅ Cleared all guild commands in server:', TEST_GUILD_ID);
  } catch (err) {
    console.error(err);
  }
})();
