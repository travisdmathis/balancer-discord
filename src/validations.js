const ethers = require("ethers");

module.exports = {
  // Checks for valid 0x address
  // @param address
  // @returns Boolean
  address: (address) => {
    try {
      ethers.utils.getAddress(address);
    } catch (error) {
      return false;
    }

    return true;
  },
};
