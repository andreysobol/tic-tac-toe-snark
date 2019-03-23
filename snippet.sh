./zokrates compile -i tictactoe.compiled.code
./zokrates setup
./zokrates compute-witness -a 0 1 9 9 9 4 5 9 9 9 2
./zokrates generate-proof
./zokrates export-verifier
