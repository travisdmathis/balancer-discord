require("dotenv").config();
const Discord = require("discord.js");
const logger = require("pino")();
const { request } = require("graphql-request");
global.fetch = require("node-fetch");

// imports
const queries = require("./queries.js");
const validations = require("./validations.js");
const format = require("./format.js");

// Bot config
const { endpoint } = require("./config.json");

// Initialize App
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

const handleMessage = async (message) => {
  const formattedMessage = format.message(message);

  if (formattedMessage.command === "balancer") {
    switch (formattedMessage.param) {
      case "help":
        message.author.send(
          "```pool [poolId] - returns information about a specific pool```"
        );

        break;
      case "pool":
        const poolId = formattedMessage.args[0];

        // Validations
        if (!formattedMessage.args.length) {
          message.channel.send(
            `You didn't provide any arguments, ${message.author}. Try !balancer help or !balancer pool [poolId]`
          );

          break;
        }

        if (!validations.address(poolId)) {
          message.channel.send(
            `You provided an invalid address, ${message.author}.`
          );

          break;
        }

        // Queries and Data
        const poolQuery = queries.getPool(poolId);
        const poolData = await request(endpoint, poolQuery);
        const pool = poolData.pools[0];

        // Format and Send to Discord
        if (pool) {
          const poolMessage = format.pool(pool);

          message.channel.send("```" + poolMessage + "```");
        } else {
          message.channel.send(
            `There is no Pool with that ID, ${message.author}`
          );
        }

        break;
      case "pool-shares":
        const userAddress = formattedMessage.args[0];

        // Validations
        if (!formattedMessage.args.length) {
          message.channel.send(
            `You didn't provide any arguments, ${message.author}. Try !balancer help or !balancer liquidity [userAddress]`
          );

          break;
        }

        if (!validations.address(userAddress)) {
          message.channel.send(
            `You provided an invalid address, ${message.author}.`
          );

          break;
        }

        // Queries and Data
        const poolShareQuery = queries.getPoolShares(userAddress);
        const poolShareData = await request(endpoint, poolShareQuery);
        const poolShares = poolShareData.poolShares;

        if (poolShares.length) {
          const poolShareMessage = await format.poolShares(poolShares);

          message.channel.send("```" + poolShareMessage + "```");
        } else {
          message.channel.send(
            `That address is not currently providing any pool liquidity, ${message.author}`
          );
        }

        break;
      default:
        message.channel.send("Sorry I don't understand that command.");

        break;
    }
  }
};
