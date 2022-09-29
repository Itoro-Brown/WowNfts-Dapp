require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const QUICKNODE_URL = process.env.QUICKNODE_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API = process.env.API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: QUICKNODE_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
