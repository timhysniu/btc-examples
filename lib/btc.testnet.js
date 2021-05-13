const axios = require('axios');

/**
 * Broadcasts a transaction to the network via blockcypher.com
 * @param {objet} 
 */
const broadcastTransaction = async (tx) => {
  try {
    const txHex = tx.toHex();
    const data = { tx: txHex };
    const resp = await axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', data);
    return resp.data;
  } catch(err) {
    console.log(`Error: could not broadcast: ${txHex}`);
    throw err;
  }
};

/**
 * Get balanace for an address
 * 
 * @param {string} address
 * @return {object}
 */
const getAddressWithTransactions = async (address) => {
  try {
    const resp = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}`);
    return resp.data;
  } catch(err) {
    console.log(`Error: could not fetch address details: ${address}`);
    throw err;
  }
};

/**
 * Fetch transaction details 
 * 
 * @param {object} tx 
 */
const getTransaction = async (tx) => {
  try {
    const resp = await axios.get(`https://api.blockcypher.com/v1/btc/test3/txs/${tx}`);
    return resp.data;
  } catch(err) {
    console.log(`Error: could not fetch transaction: ${address}`);
    throw err;
  }
};

module.exports = {
  broadcastTransaction,
  getAddressWithTransactions,
  getTransaction
}