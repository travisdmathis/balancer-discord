// Bot config
const { prefix } = require("./config.json");

module.exports = {
  pool: (pool) => {
    return `
[${module.exports.poolName(pool.tokens)}]

Id: ${pool.id}
Swap Fee: ${pool.swapFee}

${module.exports.tokens(pool.tokens)}
`;
  },

  // splits messages into command, param, and arguments
  // @param message
  // @returns formattedMessage Object Contains args, command, param
  splitMessage: (message) => {
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
  },

  // Takes in a array of tokens and creates a Pool name based on token symbols
  // @param tokens Pool tokens array
  // @returns String Discord formatted pool name
  poolName: (tokens) => {
    let poolName = "";
    let tokenCount = 0;

    tokens.forEach((token) => {
      tokenCount += 1;

      poolName =
        poolName + token.symbol + `${tokenCount != tokens.length ? "/" : ""}`;
    });

    return poolName;
  },

  // Takes in a array of tokens
  // @param tokens Pool tokens array
  // @returns String Discord formatted pool data
  tokens: (tokens) => {
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
  },
};
