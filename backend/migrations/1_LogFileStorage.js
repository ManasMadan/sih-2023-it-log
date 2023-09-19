const Migrations = artifacts.require("logFileStorage");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
