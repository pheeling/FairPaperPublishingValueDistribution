require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenType,
	TokenSupplyType,
	TokenMintTransaction,
	TransferTransaction,
	AccountBalanceQuery,
	TokenAssociateTransaction,
} = require("@hashgraph/sdk");
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const filepathTreasuryNFT = 'log/tokenIdTreasuryNFT.txt'

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const bobId = AccountId.fromString(process.env.BOB_ID);
const bobKey = PrivateKey.fromString(process.env.BOB_PVKEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const supplyKey = PrivateKey.generate();

async function executeNFTTokenCreationForTreasury(ownerId, ownerPvKey){
    try{
        const appendDataToFile = async (path, data) => {
            await appendFile(path, data)
            console.log("successfully added " + data)
        }
        //Create the NFT
        tokenId = await this.createNFT()

        //Store main NFT Token Id in File
        await appendDataToFile(filepathTreasuryNFT, 
            tokenId + "\r\n")
              .catch(err => {
              console.log(`Error Occurs, 
              Error code -> ${err.code}, 
              Error NO -> ${err.errno}`)
        })
        //Use stored ID to mint Tokens
        await mintNFT(tokenId)

        //Associate token to User
        await associateNFT(tokenId, ownerId, ownerPvKey)
    } catch (e){
        console.log(e)
    }  
}

async function executeNFTTokenCreationForTreasury(){
    try{  
        const appendDataToFile = async (path, data) => {
            await appendFile(path, data)
            console.log("successfully added " + data)
        }
        //Create the NFT
        tokenId = await this.createNFT()

        //Store main NFT Token Id in File
        await appendDataToFile(filepathTreasuryNFT, 
            tokenId + "\r\n")
              .catch(err => {
              console.log(`Error Occurs, 
              Error code -> ${err.code}, 
              Error NO -> ${err.errno}`)
        })
        //Use stored ID to mint Tokens
        await mintNFT(tokenId)

        //Associate token to User
        await associateNFT(tokenId, bobId, bobKey)
    } catch (e){
        console.log(e)
    }  
}

async function createNFT(tokenName, tokenSymbol) {

    //Create the NFT
    let nftCreate = await new TokenCreateTransaction()
    	.setTokenName(tokenName)
    	.setTokenSymbol(tokenSymbol)
    	.setTokenType(TokenType.NonFungibleUnique)
    	.setDecimals(0)
    	.setInitialSupply(0)
    	.setTreasuryAccountId(treasuryId)
    	.setSupplyType(TokenSupplyType.Infinite)
    	.setSupplyKey(operatorKey)
        .setFeeScheduleKey(operatorKey)
        .setFreezeKey(operatorKey)
    	.freezeWith(client);

    //Sign the transaction with the treasury key
    let nftCreateTxSign = await nftCreate.sign(treasuryKey);

    //Submit the transaction to a Hedera network
    let nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    let nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    let tokenId = nftCreateRx.tokenId;

    //Log the token ID
    console.log(`- Created NFT with Token ID: ${tokenId} \n`);

    return tokenId
}

async function createNFT() {

    //Create the NFT
    let nftCreate = await new TokenCreateTransaction()
    	.setTokenName("effero")
    	.setTokenSymbol("EFP")
    	.setTokenType(TokenType.NonFungibleUnique)
    	.setDecimals(0)
    	.setInitialSupply(0)
    	.setTreasuryAccountId(treasuryId)
    	.setSupplyType(TokenSupplyType.Infinite)
    	.setSupplyKey(operatorKey)
        .setFeeScheduleKey(operatorKey)
        .setFreezeKey(operatorKey)
    	.freezeWith(client);

    //Sign the transaction with the treasury key
    let nftCreateTxSign = await nftCreate.sign(treasuryKey);

    //Submit the transaction to a Hedera network
    let nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    let nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    let tokenId = nftCreateRx.tokenId;

    //Log the token ID
    console.log(`- Created NFT with Token ID: ${tokenId} \n`);

    return tokenId
}

async function mintNFT(tokenId){
    //IPFS content identifiers for which we will create a NFT
    CID = "this is the link to the real world asset";

    // Mint new NFT
    let mintTx = await new TokenMintTransaction()
    	.setTokenId(tokenId)
    	.setMetadata([Buffer.from(CID)])
    	.freezeWith(client);

    //Sign the transaction with the supply key
    let mintTxSign = await mintTx.sign(supplyKey);

    //Submit the transaction to a Hedera network
    let mintTxSubmit = await mintTxSign.execute(client);

    //Get the transaction receipt
    let mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);
}

async function associateNFT(tokenId, ownerId, ownerPvKey){
    //Create the associate transaction and sign with Alice's key 
    let associateTx = await new TokenAssociateTransaction()
        .setAccountId(ownerId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(ownerPvKey);

    //Submit the transaction to a Hedera network
    let associateTxSubmit = await associateTx.execute(client);

    //Get the transaction receipt
    let associateRx = await associateTxSubmit.getReceipt(client);

    //Confirm the transaction was successful
    console.log(`- NFT association with "`+ownerId+`" account: ${associateRx.status}\n`);
}

async function transferNFT(tokenId, ownerId){
    // Check the balance before the transfer for the treasury account
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance before the transfer for Alice's account
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(ownerId).execute(client);
    console.log(`- `+ownerId+` balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Transfer the NFT from treasury to Alice
    // Sign with the treasury key to authorize the transfer
    let tokenTransferTx = await new TransferTransaction()
    	.addNftTransfer(tokenId, 1, treasuryId, ownerId)
    	.freezeWith(client)
    	.sign(treasuryKey);

    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(`\n- NFT transfer from Treasury to ` +ownerId+ `: ${tokenTransferRx.status} \n`);

    // Check the balance of the treasury account after the transfer
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

    // Check the balance of Alice's account after the transfer
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
    console.log(`- `+ownerId+` balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);
}

//TODO: Fungible Token Creation
//Freezing, how to unfreeze?

async function createFungibleToken() {
	//CREATE FUNGIBLE TOKEN (STABLECOIN)
	let tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("efferoPay")
        .setTokenSymbol("EPP")
		.setTokenType(TokenType.FungibleCommon)
		.setDecimals(2)
		.setInitialSupply(36250000)
        .setMaxSupply(54750000)
		.setTreasuryAccountId(treasuryId)
		.setSupplyType(TokenSupplyType.Finite)
		.setSupplyKey(operatorKey)
        .setFreezeKey(operatorKey)
		.freezeWith(client);

	let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);
	let tokenCreateSubmit = await tokenCreateSign.execute(client);
	let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
	let tokenId = tokenCreateRx.tokenId;
	console.log(`- Created token with ID: ${tokenId} \n`);
}

module.exports = { createNFT, mintNFT, associateNFT, transferNFT, executeNFTTokenCreationForTreasury, createFungibleToken}