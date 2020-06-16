require("dotenv").config();
const Discord = require("discord.js");
const logger = require("pino")();
const { request } = require("graphql-request");
const queries = require("./queries.js");
const ethers = require("ethers");
global.fetch = require("node-fetch");

// Bot config
const { prefix } = require("./config.json");

// Initialize App
const endpoint =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer";
const client = new Discord.Client();
const tokenImagesUrl =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets";

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
  const formattedMessage = splitMessage(message);

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

        if (!isValidAddress(poolId)) {
          message.channel.send(
            `You provided an invalid address, ${message.author}.`
          );
        }

        // Queries and Data
        const query = queries.getPool(poolId);
        const data = await request(endpoint, query);
        const pool = data.pools[0];

        message.channel.send(`
[${formatPoolName(pool.tokens)}]

Id: ${pool.id}
Swap Fee: ${pool.swapFee}

${formatTokens(pool.tokens)}
        `);

        break;
      default:
        message.channel.send("Sorry I don't understand that command.");

        break;
    }
  }
};

// Checks for valid 0x address
// @param address
// @returns Boolean
const isValidAddress = (address) => {
  try {
    ethers.utils.getAddress(address);
  } catch (error) {
    return false;
  }

  return true;
};

// splits messages into command, param, and arguments
// @param message
// @returns formattedMessage Object Contains args, command, param
const splitMessage = (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return false;
  }

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();
  const param = args.shift().toLowerCase();
  const formattedMessage = {
    args: args,
    command: command,
    param: param,
  };

  return formattedMessage;
};

// Takes in a array of tokens and creates a Pool name based on token symbols
// @param tokens Pool tokens array
// @returns String formatted pool name
const formatPoolName = (tokens) => {
  let poolName = "";
  let tokenCount = 0;

  tokens.forEach((token) => {
    tokenCount += 1;

    poolName =
      poolName + token.symbol + `${tokenCount != tokens.length ? "/" : ""}`;
  });

  return poolName;
};

const formatTokens = (tokens) => {
  let formattedTokens = "";

  tokens.forEach((token) => {
    formattedTokens += `
      [${token.symbol}]

      Address: ${token.address}
      Balance: ${token.balance}
      Denormalized Weight: ${token.denormWeight}
      Id: ${token.id}
    `;
  });

  return formattedTokens;
};
