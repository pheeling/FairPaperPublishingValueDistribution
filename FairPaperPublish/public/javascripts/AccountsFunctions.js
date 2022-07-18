const { Client, AccountInfoQuery, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar} = require("@hashgraph/sdk");
require("dotenv").config();

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;
const client = Client.forTestnet();

async function getAccountInfo() {

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    client.setOperator(myAccountId, myPrivateKey);

    //Create the account info query
    const query = new AccountInfoQuery()
    .setAccountId(myAccountId);

    //Sign with client operator private key and submit the query to a Hedera network
    const accountInfo = await query.execute(client);

    //Print the account info to the console
    console.log(accountInfo);
}

async function getAccountBalanceTreasury(){

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    client.setOperator(myAccountId, myPrivateKey);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(myAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");
}

async function createAccounts() {

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);
    console.log("Private key " +newAccountId+ " is: " +newAccountPrivateKey);
    console.log("Public key " +newAccountId+ " is: " +newAccountPublicKey);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

}

module.exports = { getAccountInfo, createAccounts, getAccountBalanceTreasury}