const bitcoin = require('bitcoinjs-lib'); // Use version 2.2.0
const _get = require('lodash/get');
const prompt = require('syncprompt');
const { satoshiToBTC } = require('./lib/utils');
const { broadcastTransaction, getAddressWithTransactions } = require('./lib/btc.testnet');

const sendTransaction = async () => {
  const privateKey = await prompt('private key (WIF format): ');
  const destinationAddress = await prompt('Enter a destination address: ');
  const network = bitcoin.networks.testnet;

  // Fee to pay the miners in sathosis
  var txFee = 10000; // 0.0001 BTC

  // Get the source Bitcoin address from the private key
  var keyPair = bitcoin.ECPair.fromWIF(privateKey, network);

  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });

  // get address balance and its transactions
  const balanceResp = await getAddressWithTransactions(address);

  // initialize transaction
  const txb = new bitcoin.TransactionBuilder(network);
  
  // iterate through all unspent outputs until there 
  // are enough satoshis to send.
  const txs = _get(balanceResp, 'txrefs', []).filter(tx => !tx.spent);
  const { tx_hash, tx_output_n, value } = txs[0];
  const withdrawAmount = value - txFee;

  console.log('>> PUBLIC address is:       ', address);
  console.log('>> Unspent value (BTC):     ', satoshiToBTC(value));
  console.log('>> Tx fee (BTC):            ', satoshiToBTC(txFee));
  console.log('>> Withdraw amount (BTC):   ', satoshiToBTC(withdrawAmount));

  if(withdrawAmount < 0) {
    console.log('>> ERROR: insufficient funds');
    return;
  }

  txb.addInput(tx_hash, tx_output_n);

  // set destination address, and the rest is miners fee
  txb.addOutput(destinationAddress, withdrawAmount);
  txb.sign(0, keyPair);

  const tx = await txb.build();
  console.log(`>> Transaction: ${tx.toHex()}\n`);

  const broadcastConfirm = await prompt('Continue with broadcasting (y/n): ');
  if(broadcastConfirm.trim().toLowerCase() === 'y') {
    await broadcastTransaction(tx);
    console.log('\n\n>> Done.');
  }
  else {
    console.log('\n\n>> Cancelled.');
  }
}

sendTransaction();
