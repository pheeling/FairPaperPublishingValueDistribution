const { Client, AccountInfoQuery } = require("@hashgraph/sdk");
require("dotenv").config();

async function getAccountInfo() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    //Create the account info query
    const query = new AccountInfoQuery()
    .setAccountId(myAccountId);

    //Sign with client operator private key and submit the query to a Hedera network
    const accountInfo = await query.execute(client);

    //Print the account info to the console
    console.log(accountInfo);
}

module.exports = { getAccountInfo}