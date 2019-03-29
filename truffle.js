"use strict";

module.exports = {
    networks: {
        test: {
            host: "127.0.0.1",
            port: 8545,
            network_id: 5777, // Match Ganache(Truffle) network id
            gas: 6000000,
        }
    }
};
