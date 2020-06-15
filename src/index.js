require("dotenv").config();
const Discord = require("discord.js");
const logger = require("pino")();

// instantiate new Discord client
const client = new Discord.Client();

// setup Discord listeners
client.on("ready", () => {
  logger.info(`Balancer Bot: Connected as ${client.user.tag}`);
});

client.on("message", (message) => {
  handleMessage(message);
});

// login to client

client.login(process.env.DISCORD_SECRET_KEY);

// functions
const handleMessage = (message) => {
  logger.info(`Balancer Bot: Message Received[${message}]`);
};
