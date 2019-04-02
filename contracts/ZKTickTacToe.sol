pragma solidity >=0.5 <0.6;

library ECDSA {

  /**
   * @dev Recover signer address from a message by using their signature
   * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param signature bytes signature, the signature is generated using web3.eth.sign()
   */
  function recover(bytes32 hash, bytes memory signature)
    internal
    pure
    returns (address)
  {
    bytes32 r;
    bytes32 s;
    uint8 v;

    // Check the signature length
    if (signature.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables with inline assembly.
    assembly {
      r := mload(add(signature, 0x20))
      s := mload(add(signature, 0x40))
      v := byte(0, mload(add(signature, 0x60)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      // solium-disable-next-line arg-overflow
      return ecrecover(toEthSignedMessageHash(hash), v, r, s);
    }
  }

  /**
    * toEthSignedMessageHash
    * @dev prefix a bytes32 value with "\x19Ethereum Signed Message:"
    * and hash the result
    */
  function toEthSignedMessageHash(bytes32 hash)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(
      abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
    );
  }
}

contract VerifierInterface {
    function verifyTx(
            uint[2] memory a,
            uint[2]  memory a_p,
            uint[2][2] memory  b,
            uint[2] memory  b_p,
            uint[2]  memory c,
            uint[2]  memory c_p,
            uint[2]  memory h,
            uint[2]  memory k,
            uint[4]  memory input
        ) public returns (bool r);
}


contract ZKTickTacToe{
    using ECDSA for bytes32;

    VerifierInterface public verifier;

    struct GameData {
        address party1;
        uint256 bid1;
        address party2;
        uint256 bid2;
        uint8 status;
    }


    mapping (uint8 => GameData) public gamedata;  // `gameID` => `GameData`


    /// EVENTS ///

    event BidReceived(uint8 gameID, address who, uint256 value);
    event GameVerified(uint8 gameID, address winner, uint256 winamount);
    event Error(string s);

    /// CONSTRUCTOR ///

    constructor(address _verifier) public {
        verifier = VerifierInterface(_verifier);
    }

    function bid(uint8 _gameID)
     external
     payable
    {
        require(msg.value>0);

        GameData storage gd = gamedata[_gameID];

        //status = 0 - doesn't exist
        //status = 1 - party 1 bid
        //status = 2 - party 2 bid
        //status = 3 - verified and closed;

        require(gamedata[_gameID].status < 3);

        //new game
        if (gd.status==0x0) {
            gamedata[_gameID] = GameData (msg.sender,msg.value, address(0x0), 0x0, 1);
            emit BidReceived(_gameID, msg.sender, msg.value);
            return;
        }

        //2nd party bid
        if (gd.status==1){
            gamedata[_gameID].party2=msg.sender;
            gamedata[_gameID].bid2=msg.value;
            gamedata[_gameID].status=2;
            emit BidReceived(_gameID, msg.sender, msg.value);
        }

    }

    function _prevalidate(uint8 _gameID,
            uint256 _shaMovesGameID,
            bytes memory _signature)
            private
            returns
            (bool r){
            //game in correct state
            require(gamedata[_gameID].status==2);
            emit Error("status checked");

            bytes32 message=bytes32(_shaMovesGameID);

            address looserParty=message.recover(_signature);

            //winner to send this transaction
            require(looserParty!=msg.sender);
            emit Error("looser party not sender");

            //correctParties
            address party1=gamedata[_gameID].party1;
            address party2=gamedata[_gameID].party2;
            require(party1==msg.sender && party2==looserParty || party2==msg.sender && party1==looserParty);
            emit Error("parties checked");

            return true;
            }


    function _payout(uint8 _gameID)
            private
            returns
            (bool r){
                msg.sender.transfer(gamedata[_gameID].bid1+gamedata[_gameID].bid2);
                return true;
            }

    function verifyTx(
            uint8 _gameID,
            uint256 _shaMovesGameID,
            bytes memory _signature,
            uint[2]  memory a,
            uint[2]  memory a_p,
            uint[2][2] memory  b,
            uint[2]  memory b_p,
            uint[2]  memory c,
            uint[2]  memory c_p,
            uint[2]  memory h,
            uint[2]  memory k
        ) public returns (bool){

            require(_prevalidate(_gameID,_shaMovesGameID,_signature));

            uint[4] memory input = [uint(_gameID), uint128(_shaMovesGameID >> 128), uint128(_shaMovesGameID), 1];
            //
            emit Error("Game validation done");

            if(verifier.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input)){
                require(_payout(_gameID));
                emit Error("Game paid");
                gamedata[_gameID].status = 3;
                return true;
            }else{
                emit Error("Game validation failed");
                return false;
            }

        }






}
