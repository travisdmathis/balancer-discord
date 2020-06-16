module.exports = {
  getPool: (poolId) => {
    return `
      {
        pools(where: {id: "${poolId}", publicSwap: true}) {
          id
          swapFee
          tokens {
            id
            address
            balance
            decimals
            symbol
            denormWeight
          }
        }
      }
    `;
  },
};
