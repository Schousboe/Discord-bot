import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

// Intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Token
const TOKEN = process.env.DISCORD_TOKEN;

// When bot ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Welcome
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`Welcome to the Ditogames cave, ${member}! 🎉
    Please read the rules and have fun!`);
  }
});

// Commands
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; 

  // Help
  if (message.content === "!help") {
    return message.reply(
      "**Available commands:**\n" +
      "`!help` – Shows this help menu.\n" +
      "`!message` – Only a server manager can send a message through this bot."
    );
  }

  // Message
  if (!message.content.startsWith("!message")) return;

  if (!message.member.permissions.has("Administrator")) {
    return message.reply("You must have Administrator permissions to use this command.");
  }

  const args = message.content.slice("!message".length).trim();
  if (!args.length) return message.reply("You have to write a message!");

  let targetChannel = message.channel;
  let ending = " \n\n*This message was triggered automatically by an administrator.*"
  let text = args+ending;

  // Channel mentioned
  if (message.mentions.channels.size > 0) {
    targetChannel = message.mentions.channels.first();
    text = args+ending.slice(1).join(" "); 
  }

  if (!text.length) return message.reply("You have to write a message!");

  try {
    await message.delete();         // Delete command
    await targetChannel.send(text); // Send
  } catch (err) {
    console.error("Couldn't send message", err);
  }
});

// Dummy server
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () => console.log(`Webserver is running on ${PORT}`));

client.login(TOKEN);
