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
  getPoolShares: (userAddress) => {
    return `
    {
      poolShares(where: {userAddress: "${userAddress}", balance_not: 0}) {
        id
        balance
        poolId {
          id
        }
      }
    }
    `;
  },
};
