const Verifier = artifacts.require("Verifier");
const ZKTicTacToe = artifacts.require("ZKTickTacToe");

module.exports = function(deployer) {
    deployer.deploy(ZKTicTacToe, Verifier.address);
};