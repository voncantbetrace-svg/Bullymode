await rest.put(
  Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
  { body: [] } // empty array removes all guild commands
);
