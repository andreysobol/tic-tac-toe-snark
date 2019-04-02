package com.tictactoe.params;


import org.bouncycastle.util.Arrays;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class WitnessParams {

    public static void main(String[] args) throws Exception{

        int[] pw = new int[] {0, 1, 9, 9};
        int[] pl = new int[] {4, 5, 9, 9};
        int c = 2;
        int gameID= 123;

        if(args.length>0) {
            System.out.println("Reading params from command line... ");
            int index = 0;
            gameID = Integer.parseInt(args[index++]);
            System.out.println("gameID="+gameID);
            for (int i = 0; i < 4; i++) {
                pw[i] = Integer.parseInt(args[index++]);
                System.out.println("pw["+i+"]="+pw[i]);
            }
            for (int i = 0; i < 4; i++) {
                pl[i] = Integer.parseInt(args[index++]);
                System.out.println("pl["+i+"]="+pw[i]);
            }
            c = Integer.parseInt(args[index++]);
            System.out.println("c="+c);
        }
        else
            System.out.println("Using compiled-in params");

        //field[2] hash1 = sha256packed(pw)
        //field[2] hash2 = sha256packed(pl)
        //field[2] hash3 = sha256packed([hash1[0], hash1[1], hash2[0], hash2[1]])
        //field[2] hash4 = sha256packed([0, gameID, hash3[0], hash3[1]])
        //hash4[0] == shaValue[0]
        //hash4[1] == shaValue[1]

        byte[] hash1byte = org.web3j.crypto.Hash.sha256(Arrays.concatenate(
                Numeric.toBytesPadded(BigInteger.valueOf(pw[0]), 16),
                Numeric.toBytesPadded(BigInteger.valueOf(pw[1]), 16),
                Numeric.toBytesPadded(BigInteger.valueOf(pw[2]), 16),
                Numeric.toBytesPadded(BigInteger.valueOf(pw[3]), 16)));

        byte[] hash2byte = org.web3j.crypto.Hash.sha256(Arrays.concatenate(
                Numeric.toBytesPadded(BigInteger.valueOf(pl[0]), 16),
                Numeric.toBytesPadded(BigInteger.valueOf(pl[1]), 16),
                Numeric.toBytesPadded(BigInteger.valueOf(pl[2]), 16),
                Numeric.toBytesPadded(BigInteger.valueOf(pl[3]), 16)));

        BigInteger[] hash1 = bytes32_to_uint128(hash1byte);

        BigInteger[] hash2 = bytes32_to_uint128(hash2byte);

        byte[] hash3bytes = org.web3j.crypto.Hash.sha256(Arrays.concatenate(
                Numeric.toBytesPadded(hash1[0], 16),
                Numeric.toBytesPadded(hash1[1], 16),
                Numeric.toBytesPadded(hash2[0], 16),
                Numeric.toBytesPadded(hash2[1], 16)));

        BigInteger[] hash3 = bytes32_to_uint128(hash3bytes);

        byte[] hash4byte = org.web3j.crypto.Hash.sha256(Arrays.concatenate(
                Numeric.toBytesPadded(BigInteger.ZERO, 16),
                Numeric.toBytesPadded(BigInteger.valueOf(gameID), 16),
                Numeric.toBytesPadded(hash3[0], 16),
                Numeric.toBytesPadded(hash3[1], 16)));

        BigInteger[] hash4 = bytes32_to_uint128(hash4byte);

        System.out.println("Public circuit params:");
        System.out.println("gameID="+gameID);
        System.out.println("shaValue[0]="+hash4[0].toString());
        System.out.println("shaValue[1]="+hash4[1].toString()+"\n");

        //zokrates compute-witness
        StringBuilder sb=new StringBuilder().append("zokrates compute-witness -a ").append(gameID).append(' ').append(hash4[0].toString()).append(' ').append(hash4[1].toString()).append(' ');
        for(int i=0;i<pw.length;i++)
        {
            sb=sb.append(pw[i]).append(' ');
        }
        for(int i=0;i<pl.length;i++)
        {
            sb=sb.append(pl[i]).append(' ');
        }
        sb=sb.append(c);

        System.out.println(sb.toString());


    }

    /**
     * Solidity:
     * function bytes32_to_uint128(bytes32 value) public pure returns(uint128[2] memory) {
     *         return [uint128(bytes16(value)), uint128(uint256(value))];
     *     }
     *
     * @param byte32_256
     * @return
     */
    private static BigInteger[] bytes32_to_uint128(byte[] byte32_256){
        BigInteger one = new BigInteger(1, Arrays.copyOfRange(byte32_256, 0, (byte32_256.length / 2)));
        BigInteger two = new BigInteger(1, Arrays.copyOfRange(byte32_256, (byte32_256.length / 2), byte32_256.length));
        return new BigInteger[] {one, two};
    }

}
