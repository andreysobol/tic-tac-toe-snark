const ZKTicTacToe = artifacts.require("ZKTickTacToe");
const { proof, input } = require("./common/proof");

contract("ZKTicTacToe", async (accounts) => {
    let A = proof.A;
  	let A_p = proof.A_p;
  	let B = proof.B;
  	let B_p = proof.B_p;
  	let C = proof.C;
  	let C_p = proof.C_p;
  	let H = proof.H;
  	let K = proof.K;
    let Input = input;
    let gameId = Input[0];
    let shaValue = ('0x' + new web3.utils.BN(Input[1]).toString(16, 32) + new web3.utils.BN(Input[2]).toString(16, 32));

    // incorrect proof value
    let A_false = ["0x28412ee8948d4f99ea4f59ab58e698a1cd2365b3c7613a37ba3de56cb124dff7", "0x23ea3c53236cc9e3091a65b678210437be82520f9899edf15beec13e7fa0f277"];
      
    const user_winner = accounts[1];
    const user_looser = accounts[2];
    const user_fake = accounts[3];

    before("setup", async () => {
        await ZKTicTacToe.deployed()
            .then(async instance => {
                await instance.bid(gameId, {value: web3.utils.toWei("1", "ether"), from: user_winner});
                return instance;
            })
            .then(async instance => {
                await instance.bid(gameId, {value: web3.utils.toWei("1", "ether"), from: user_looser});
                return instance;
            });
    });

    it("should send correct verification", async () => {
        let signature = await web3.eth.sign(shaValue, user_looser);
        await ZKTicTacToe.deployed()
            .then(async instance => {
                let recipe = await instance.verifyTx(
                    gameId,
                    shaValue,
                    signature,
                    A,
                    A_p,
                    B,
                    B_p,
                    C,
                    C_p,
                    H,
                    K,
                    {from: user_winner}
                );
                assert.equal(recipe.receipt.logs[4].args.s, 'Game paid', "Verification failed");
            });
    });

    it("should fail with incorrect proof", async () => {
        let signature = await web3.eth.sign(shaValue, user_looser);
        await ZKTicTacToe.deployed()
            .then(async instance => {
                let recipe = await instance.verifyTx(
                    gameId,
                    shaValue,
                    signature,
                    A_false,
                    A_p,
                    B,
                    B_p,
                    C,
                    C_p,
                    H,
                    K,
                    {from: user_winner}
                );
                assert.equal(false, true, "Verification not failed"); // this code should not be executed
            }).catch(e => {
                // correct exception
            });
    });

    it("should fail with incorrect user account", async () => {
        let signature = await web3.eth.sign(shaValue, user_fake);
        await ZKTicTacToe.deployed()
            .then(async instance => {
                let recipe = await instance.verifyTx(
                  gameId,
                  shaValue,
                  signature,
                  A,
                  A_p,
                  B,
                  B_p,
                  C,
                  C_p,
                  H,
                  K,
                  {from: user_winner}
              );
              console.log(recipe);
              assert.equal(false, true, "User recognized"); // this code should not be executed
            }).catch(e => {
                // correct exception
            });
    });

});