const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const prompt = require('syncprompt');

// Generate number of private keys
const maxKeys = 2;

const generateKeys = async () => {
  const networkStr = await prompt('network? (testnet or mainnet): ');
  const isMainNet = (networkStr === 'mainnet');
  const network = isMainNet ? bitcoin.networks.mainnet : bitcoin.networks.testnet;
  const outputFile = isMainNet ? 'keys/mainnet_private_keys.txt' : 'keys/testnet_private_keys.txt';

  const stream = fs.createWriteStream(outputFile);

  stream.once('open', function(fd) {
    for (let i=0; i<maxKeys; i++) {
      const keyPair = bitcoin.ECPair.makeRandom({ network });
      const privateKeyWIFCompressed = keyPair.toWIF();
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
      const line = [i, privateKeyWIFCompressed, address];
      stream.write(line.join(", "));
      stream.write("\n");
    }
    stream.end();
  });
}

generateKeys();
