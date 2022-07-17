var express = require('express');
var router = express.Router();

// custom hedera modules
var hederaAccount = require('../public/javascripts/getAccountInfo');

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

/* GET upload papers */
router.get('/upload', function(req, res, next) {
  res.render('uploadPapers', { title: 'Upload your documents' });
});

router.get('/getAccountInfo', function(req, res, next) {
  hederaAccount.getAccountInfo().then(response => {
    res.render('foundation', { title: 'Hedera Account Info' });
  });
});




module.exports = router;
