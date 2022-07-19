var express = require('express');
var router = express.Router();

//load custom modules
var fileHandling = require('../public/javascripts/FileHandling');

/* GET main foundation site. */
router.get('/', function(req, res, next) {
  res.render('uploadPapers', { title: 'Working with the (companyName)' });
});

/* POST upload papers */
router.post('/upload', function(req, res) {
    let file;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    file = req.files.fileUpload;

    //no error handling
    fileHandling.saveFile(file).then( result =>{
        res.render('uploadPapers', { title: "Fileupload: " + result });
    })
});

module.exports = router;