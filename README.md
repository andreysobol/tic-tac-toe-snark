# Tic-tac-toe using ZK SNARK

<img src="imgs/logo.png">

## Position numbers

<img height="300" src="imgs/position_numbers.png">

## Input structure

- **field[4] pw** - list of winner previous moves. It can be position number (0-8) or empty move (9)
- **field[4] pl** - list of loser previous moves. It can be position number (0-8) or empty move (9)
- **field c** - current move. It should be position number (0-8).

## Main protocol

Tic-tac-toe zk snark protocol:

![Main tic-tac-toe zk snark protocol](imgs/proto.png)

## Verification

<img height="300" src="imgs/diagonals.png">

```
(0, 4, 8)
(2, 4, 6)
```

<img height="300" src="imgs/vertical.png">

```
(0, 3, 6)
(1, 4, 7)
(2, 5, 8)
```

<img height="300" src="imgs/horizontal.png">

```
(0, 1, 2)
(3, 4, 5)
(6, 7, 8)
```

#### Main contition

```
pw + c ∈ (0, 1, 2) or
pw + c ∈ (3, 4, 5) or
...
pw + c ∈ (2, 4, 6)

```

#### Condition against cheating

<img height="300" src="imgs/cheat.png">

```
Move1 != Move2 or ((Move1==Ø) and (Move2==Ø))
```

## Build

#### Generation

```
python generator.py
```

#### Compilation, Setup, Generation proof and verifier

```
./zokrates compile -i tictactoe.compiled.code
./zokrates setup
./zokrates compute-witness -a 0 1 9 9 4 5 9 9 2
./zokrates generate-proof
./zokrates export-verifier
````

#### Deployment & verification (Dummy way)
Extract verifier smart contract from zokrates docker image
```
docker cp <docker_id>:/home/zokrates/verifier.sol ./<CONTRACT_PATH>
```
##### Deployment

* Open Remix browser https://remix.ethereum.org
* Open *verifier.sol* in Remix
* From the right side menu, select Compile tab.
* Push *Start to compile (Ctrl-S)* button. Make sure compilation is successful
* From the right side menu, select Run tab.
* Make sure Metamask is unlocked, network is selected to the one you need (Ropsten for example) and wallet selected has some ETH
* Push *Deploy* button (sign transaction in Metamask and wait until mined)

##### Verification

* Extract *proof.json* file from zokrates docker image
```
docker cp <docker_id>:/home/zokrates/proof.json ./<CONTRACT_PATH>
```
* Expand *verifyTx* function call tab.
* Fill in fields from *proof.json* (copy & paste).
* push *verifyTx* button. Confirm transaction in Metamask. 
* When transaction mined, check that Verified("Transaction verified successfully") is emitted (on Etherscan)
