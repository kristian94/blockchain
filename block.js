const crypto = require('crypto-js');

function Block(data, hash, nonce){
    this.timestamp = new Date().getTime();
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.previousHash = "";
    this.index = -1;
}

Block.prototype.generateHashAndSet = function(){
    // return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    this.hash = crypto.SHA256()


};

module.exports = Block;
