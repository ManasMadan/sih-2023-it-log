const logFileStorage = require("./build/logFileStorage.json");
const Web3 = require("web3");
const utils = require("./utils");

let web3, contract;
const initializeWeb3 = async () => {
  if (web3 && contract) return;
  const provider = new Web3.Web3.providers.HttpProvider(
    "HTTP://127.0.0.1:7545"
  );
  web3 = new Web3.Web3(provider);
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = logFileStorage.networks[networkId];
  contract = new web3.eth.Contract(logFileStorage.abi, deployedNetwork.address);
};

const getBlocksData = async () => {
  const data = await contract.methods.getter().call({ gas: "1000000" });
  return utils.processJSONforBigInt(data);
};

const addBlock = async (ipfs, camp) => {
  const write = await contract.methods.setter(ipfs, camp).send({
    from: process.env.SENDER_ACCOUNT,
    gas: "1000000",
  });
  return utils.processJSONforBigInt(write);
};

const getAccounts = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts;
};

module.exports = {
  initializeWeb3,
  web3,
  contract,
  getBlocksData,
  addBlock,
  getAccounts,
};
