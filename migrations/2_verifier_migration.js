const Verifier = artifacts.require("verifier");

module.exports = function(deployer) {
  deployer.deploy(Verifier);
};
