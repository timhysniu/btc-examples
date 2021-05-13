# Sending BTC with NodeJS

### Table of Contents
- [Overview](#overview)
- [Sending Bitcoins on Testnet](#sending-bitcoins-on-testnet)
  - [Create Keys](#create-keys)
  - [Example2](#example2)
  - [Third Example](#third-example)
  - [Fourth Example](#fourth-examplehttpwwwfourthexamplecom)
- [Sending Bitcoins on Mainnet](#sending-bitcoins-on-mainnet)

These are test cases using `bitcoinjs-lib` library for:
- Creating private/public key pairs
- Checking the balances
- Broadcasting a transaction

## Overview

This is a collection of example scripts used to generate keys, retrieve balance, and send BTC to
an address. _blockchain.info_ does no longer have testnet, so we are making use of _blockcypher.com_
for testnet.

## Sending Bitcoins on Testnet

### Create Keys

This will generate a two private key / public key pairs. This will look something like this:
```
0, cU2tEpvifx1VMs2bp5NNKRtah8mbaBgzE8GpaE8wfbHQ39KWXYsC, n4qtLJW22QbdCg1dJFssaZ3pH4JRFfFJW3
1, cU7javt6KpNKRc5KaYc7t1ktTFKgWyJCYmN2QUjdaA2maM7ZVQSf, mqjis7dhTYT3UY6S9GBmM2AsBwmLuwbzh6
```

First column is private key and second column is the private key.
Grab the public key of first pair (0) and fund it with some BTC using [testnet.coinfaucet.eu](https://testnet.coinfaucet.eu/en/
). Then later we are going to send to second pair (1).

You will need to specify the network. To run:

```
node generate-keys.js

network? (testnet or mainnet): mainnet
```

For mainnet check `keys/private_keys.txt`, or for testnet check `keys/testnet_private_keys.txt`.


**IMPORTANT**: Save your keys before generating new ones because they will get overwritten!


### Get Balance for Address

If the funds are still unconfirmed you need to wait until they are showing in balance.
This takes a bit of time but not very long.

```
node get-balance-for-address.js        

please enter address: n4qtLJW22QbdCg1dJFssaZ3pH4JRFfFJW3
network? (testnet or mainnet): testnet
Received: 0.01049969
Sent: 0
Balance: 0.01049969
Unconfirmed Balance: 0
```

### Send Transaction

Now that we have some balance we are going to send the entire amount less a mining fee of 0.0001 BTC.

```
node send-transaction-testnet.js

private key (WIF format): cU2tEpvifx1VMs2bp5NNKRtah8mbaBgzE8GpaE8wfbHQ39KWXYsC
Enter a destination address: mqjis7dhTYT3UY6S9GBmM2AsBwmLuwbzh6
>> PUBLIC address is:        n4qtLJW22QbdCg1dJFssaZ3pH4JRFfFJW3
>> Unspent value (BTC):      0.018713610000000002
>> Tx fee (BTC):             0.0001
>> Withdraw amount (BTC):    0.01861361
>> Transaction: 0200000001243be7c048c836329e9f444a1d6f089473daf87185e043e0e911ada37f7ecc37000000006b483045022100c2cc748e43c94978471ef1ad6f9d4f53e2d0ad340e7323ad6b564137372be1e3022027b230f8afe1e27bd36af80afa1a6cb24466fce8d231ed13ee5b1f7b5d0d2b30012102d29080db4119b65f6717f20a3c34c532e07c3fe4ebbb644f88414e926875ffedffffffff01f1661c00000000001976a914701b745ded1c3505837e536b55645e636fbd6b2888ac00000000

Continue with broadcasting (y/n): y

>> Done.
```

## Sending Bitcoins on Mainnet

Will be filled later.