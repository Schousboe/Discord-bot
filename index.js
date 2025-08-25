import { Client, GatewayIntentBits } from "discord.js";

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

// When bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Welcome
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`Welcome to the Dittogames cave, ${member}! 🎉
    Please read the rules and have fun!`);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; 
  if (!message.content.startsWith("!message")) return;

  if (message.guild.ownerId !== message.author.id) {
    return message.reply("Only the owner of this server can use this command!");
  }

  const args = message.content.slice("!message".length).trim().split(" ");
  if (!args.length) return message.reply("You have to write a message!");

  let targetChannel = message.channel;
  let text = args.join(" ");

// If channel mentioned
  if (message.mentions.channels.size > 0) {
    targetChannel = message.mentions.channels.first();
    text = args.slice(1).join(" "); 
  }

  if (!text.length) return message.reply("You have to write a message!");

  try {
    await message.delete();         // Delete command
    await targetChannel.send(text); // Send
  } catch (err) {
    console.error("Couldn't send message", err);
  }
});

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`🌐 Webserver is running on ${PORT}`));

// Token login
client.login(TOKEN);
