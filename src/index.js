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

client.login("NzIyMDk4NjIyNjI3MzE1NzIy.XueeRg.eSjxW53qydMt-5DYbC5K0deH57Q");

// functions
const handleMessage = (message) => {
  logger.info(`Balancer Bot: Message Received[${message}]`);
};
