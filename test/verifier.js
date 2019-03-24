const Verifier = artifacts.require("verifier");

contract("Verifier", async accounts => {

  it("should call a function that depends on a linked library", async () => {

  		let A = ["0x12481018d4fc336e2a1a1c013e8cd8041f7cbb96e26249e583bdd4240f129a3f", "0xd7efbd82ba11ba0f5a110f34aa45bd6cb9e2da072ba4e0b8e9e7da943ef0391"];
  		let A_p = ["0x2f38e77f7067074dbdc7e01cc9aa15f02396ada97b857a6d1ea23dbba98551bd", "0xea064439c346473723d526d9461408b06ed10a42fe868a82602a3c808254ac"];
  		let B = [["0x1964a2769b0e2db7836f0f359673b8f1ed83f69bfbb8670f598f14afb81bd4a1", "0x1953d0821dd15d883fdfa893c6ab54163246564bd8af39f1a4ffd46602a0a0cc"], ["0x2ea102fb122942ea5e53989dd90859b2dff490b64d0c54b4ed9d6f60dc1611a4", "0x2b39c23898c8df33147ca5c538793d038e1bd92de54bc6e4812065bb6af6dffe"]];
  		let B_p = ["0x2c3fa49a1e165fb47a48bdd914c7fe04efe290e9c82273e03182c09227155d70", "0x27984c77408d209f4a5a5de3c84fb627f7283f3450a46871c549f58b4900e2a"];
  		let C = ["0x27cdfc3555dc1cb2db39f12d7bc7ce5603347f97a4615fb5661ac5bc1738fdcb", "0x41e525dd41b2d40f3cd100322342942524f967ad5029b8294cdc6d8ff69448a"];
  		let C_p = ["0x8903fec03cd2c53ab3665c81a18eb6f897f981a8bdc483acbb5c88e4560426f", "0x208436a96d5781b3b8b23c236a3f8fbcb334ed6b999d58f9b51a50b2330e7591"];
  		let H = ["0x2d3a4bfe59906589cb4d5eac981feae1e2f69fe1e88073fbdd558e77d9dd5d2", "0x1c3a2cf3be136d50f5b728bda1c856ab21edf3f46b52a32de961bc98b8446d92"];
  		let K = ["0x5f6dc573e137c93d97b6f2a1ba14db09188a89d087fdb93487f78bc99ea8a70", "0xb3955c9f8ceca389cf12ce38b25f9be6cb0206d682262b4999fb53b7f280c2a"];
  	let Input = [12345,8276387458253,1];

    console.log('test');

    let verifier = await Verifier.deployed();

    let recipe = await verifier.verifyTx(A,A_p, B, B_p, C, C_p, H, K, Input);

   console.log(recipe);
   assert.equal('Verified',recipe.receipt.logs[0].event,"Verification failed");
  });
});
