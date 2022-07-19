const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const filePathLibrary = 'log/filePathLibrary.txt'

var hederaToken = require('./TokenFunctions');

const appendDataToFile = async (path, data) => {
    await appendFile(path, data)
    console.log("successfully added " + data)
}

async function saveFile(file){
    try{
        filehash = require('crypto')
        .createHash('sha256')
        .update(file.name)
        .digest('hex')

        uploadPath = process.cwd + '/media/files/' + file.name+"_"+filehash+"_"+Date.now();
        file.mv(uploadPath, function(err){
            if(err){
                return err
            }
        })

        await saveMetaData(file,filehash)

        return "Success"
    } catch (e){
        return e
    }
}

async function saveMetaData(file,filehash){

    mintInfo = await hederaToken.mintNFT("0.0.47703603",filehash)

    await appendDataToFile(filePathLibrary, 
        file.name+","+filehash+","+mintInfo+"\r\n")
          .catch(err => {
          console.log(`Error Occurs, 
          Error code -> ${err.code}, 
          Error NO -> ${err.errno}`)
    })

}

module.exports = { saveFile }