const Verifier = artifacts.require("Verifier");

const { proof, input } = require("./common/proof");

contract("Verifier", async accounts => {

  it("should call a function that depends on a linked library", async () => {

  	let A = proof.A;
  	let A_p = proof.A_p;
  	let B = proof.B;
  	let B_p = proof.B_p;
  	let C = proof.C;
  	let C_p = proof.C_p;
  	let H = proof.H;
  	let K = proof.K;
  	let Input = input;

    let verifier = await Verifier.deployed();

    let recipe = await verifier.verifyTx(A,A_p, B, B_p, C, C_p, H, K, Input);

  	console.log(recipe);
  	assert.equal('Verified',recipe.receipt.logs[0].event,"Verification failed");
  });
});
