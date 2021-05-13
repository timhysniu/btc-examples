/**
 * Checks a balance for an address. If there are unconfirmed funds they will be
 * shown as well.
 * 
 * To get testnet funds use a faucet at: https://testnet.coinfaucet.eu/en/
 */

const prompt = require('syncprompt');
const request = require('request');

// Convert 'satoshi' to bitcoin value
const satoshiToBTC = function(value) {
	return value * 0.00000001;
}

const getBalance = async () => {
	const address = await prompt('please enter address: ');
	const network = await prompt('network? (testnet or mainnet): ');
	const isTestnet = (network !== 'mainnet');
	
	// Query blockchain.info for the address in JSON format
	const url = isTestnet ?
		`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance` :
		`https://blockchain.info/rawaddr/${address}`
	
	request(url, function (error, response, body) {
		// Check the results of the HTTP call
		if (!error && response.statusCode == 200) {
			// Parse the JSON results
			var result = JSON.parse(body);
			// Display the results to the console
			// The results are in 'satoshis' and need to be converted to BTC
			console.log('Received: ' + satoshiToBTC(result.total_received));
			console.log('Sent: ' + satoshiToBTC(result.total_sent));
			console.log('Balance: ' + satoshiToBTC(result.final_balance));
			console.log('Unconfirmed Balance: ' + satoshiToBTC(result.unconfirmed_balance));
		} else {
			// handle the error
			console.log("Unable to find address");
			if (error) console.log("ERROR:", error);
		}
	});
};

getBalance();