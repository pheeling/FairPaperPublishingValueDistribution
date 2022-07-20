var express = require('express');
var router = express.Router();

//load custom modules
var fileHandling = require('../public/javascripts/Files');

/* GET main library site. */
router.get('/', function(req, res, next) {
    res.render('searchPapers', { title: 'Working with the (companyName)'});
});

/* get upload papers */
router.get('/search', function(req, res) {
  fileHandling.readFolderContents().then(response => {
    res.send(response)});
});

module.exports = router;