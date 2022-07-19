var express = require('express');
var router = express.Router();

// custom hedera modules
var hederaAccount = require('../public/javascripts/AccountsFunctions');
var hederaToken = require('../public/javascripts/TokenFunctions');

/* GET main foundation site. */
router.get('/', function(req, res, next) {
  res.render('foundation', { title: 'Working with the (companyName)' });
});

/* GET funding / token buyin site */
router.get('/fund', function(req, res, next) {
  res.render('fundTreasury', { title: 'Get your stake (companyName)' });
});

/* GET search treasury library */
router.get('/search', function(req, res, next) {
  res.render('searchPapers', { title: 'Discover new ideas' });
});

router.get('/getAccountInfo', function(req, res, next) {
  hederaAccount.getAccountInfo().then(response => {
    res.render('foundation', { title: 'Hedera Account Info' });
  });
});

router.get('/createAccounts', function(req, res, next) {
  hederaAccount.createAccounts().then(response => {
    res.render('foundation', { title: 'Hedera Account creation' });
  });
});

router.get('/executeNFTTokenCreationForTreasury', function(req, res, next) {
  hederaToken.executeNFTTokenCreationForTreasury().then(response => {
    res.render('foundation', { title: 'Hedera NFT creation' });
  });
});

router.get('/getAccountBalanceTreasury', function(req, res, next) {
  hederaAccount.getAccountBalanceTreasury().then(response => {
    res.render('foundation', { title: 'Hedera Account Balance' });
  });
});

router.get('/createDailySupply', function(req, res, next) {
  hederaToken.createDailySupply().then(response => {
    res.render('foundation', { title: 'Hedera mint Daily Supply' });
  });
});

router.get('/createFungibleToken', function(req, res, next) {
  hederaToken.createFungibleToken().then(response => {
    res.render('foundation', { title: 'Hedera create fungible Token' });
  });
});

router.get('/setNewCustomFixedFee', function(req, res, next) {
  hederaToken.setNewCustomFixedFee().then(response => {
    res.render('foundation', { title: 'Hedera set custom fixed Fee' });
  });
});

module.exports = router;
