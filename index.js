import { Client, GatewayIntentBits } from "discord.js";

// Bot intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // kræver Server Members Intent i Developer Portal
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Token fra Replit Secret
const TOKEN = process.env.DISCORD_TOKEN;

// Når botten starter
client.once("ready", () => {
  console.log(`✅ Logget ind som ${client.user.tag}`);
});

// Velkomstbesked
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`Welcome to the Dittogames cave, ${member}! 🎉`);
  }
});

// !message kommando
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignorer bot beskeder
  if (!message.content.startsWith("!message")) return;

  // Kun ejeren af serveren kan bruge kommandoen
  if (message.guild.ownerId !== message.author.id) {
    return message.reply("Kun ejeren af serveren kan bruge denne kommando!");
  }

  const args = message.content.slice("!message".length).trim().split(" ");
  if (!args.length) return message.reply("Du skal skrive en besked.");

  let targetChannel = message.channel;
  let text = args.join(" ");

  // Hvis første argument er en kanal mention (#kanal)
  if (message.mentions.channels.size > 0) {
    targetChannel = message.mentions.channels.first();
    text = args.slice(1).join(" "); // fjern kanal mention fra besked
  }

  if (!text.length) return message.reply("Du skal skrive en besked.");

  try {
    await message.delete();         // Slet ejers kommando
    await targetChannel.send(text); // Send besked via botten
  } catch (err) {
    console.error("Kunne ikke sende besked:", err);
  }
});

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Botten kører!"));
app.listen(PORT, () => console.log(`🌐 Webserver kører på port ${PORT}`));

// Login med token
client.login(TOKEN);
