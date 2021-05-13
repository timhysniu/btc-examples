const bitcoin = require('bitcoinjs-lib'); // Use version 2.2.0
const request = require('request');
const prompt = require('syncprompt');


// Convert 'satoshi' to bitcoin value
var satoshiToBTC = (value) => {
	return value * 0.00000001;
};

// Broadcasts a transaction to the network via blockchain.info
const broadcastTransaction = (tx) => {
  const uri = 'https://blockchain.info/pushtx';
	console.log("tx in hex = ", tx.toHex());

	var options = {
		uri,
		method: 'POST',
		json: {
			"tx": tx.toHex()
		}
	};

	request(options, function(err, httpResponse, body) {
		if (err) {
			console.error('Request failed:', err);
		} else {
			console.log('Broadcast results:', body);
			console.log("Transaction send with hash:", tx.getId());
		}
	});
};

const sendTransaction = async () => {
  const privateKey = await prompt('private key (WIF format): ');
  const destinationAddress = await prompt('Enter a destination address: ');
  const network = bitcoin.networks.mainnet;

  // Fee to pay the miners in sathosis
  var tx_fee = 10000; // 0.0001 BTC

  // Get the source Bitcoin address from the private key
  var keyPair = bitcoin.ECPair.fromWIF(privateKey, network);

  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });

  console.log('>> PUBLIC address is', address);

  // Query blockchain.info for the unspent outputs from the source address
  var url = `https://blockchain.info/unspent?active=${address}`;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      // Parse the response and get the first unspent output
      var json = JSON.parse(body);
      var unspent = json["unspent_outputs"][0];

      console.log(">> JSON unspent", unspent);

      // Prompt for the destination address
      console.log(">> Found an unspent transaction output with ", satoshiToBTC(unspent.value), " BTC.");

        // Calculate the withdraw amount minus the tx fee
        var withdraw_amount = unspent.value - tx_fee;

        console.log("Unspent value (BTC)= ", satoshiToBTC(unspent.value));
        console.log("Tx fee (BTC)= ", satoshiToBTC(tx_fee));
        console.log("Withdraw amount (BTC)= ", satoshiToBTC(withdraw_amount));

        // Build a transaction
        console.log("TransactionBuilder input tx_hash_big_endian = ", unspent.tx_hash_big_endian);
        console.log("TransactionBuilder input tx_output_n = ", unspent.tx_output_n);

        var txb = new bitcoin.TransactionBuilder();
        txb.addInput(unspent.tx_hash_big_endian, unspent.tx_output_n);
        txb.addOutput(destinationAddress, withdraw_amount);

        txb.sign(0, keyPair);
        var tx = txb.build();

        console.log("tx = ", tx);

        broadcastTransaction(tx);

    } else {
      console.log("Unable to find any unspent transaction outputs.");
      if (error) console.log("ERROR:", error);
    }
  });
}

sendTransaction();
