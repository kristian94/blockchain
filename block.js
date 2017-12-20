const crypto = require('crypto-js');
const entropyString = require('entropy-string');
const _ = require('./helpers');

const difficulty = 5; // number of zeroes a hash should start with

const getStamp = Symbol();
const hashIsValid = Symbol();

const entropy = { // used for generating nonces
    random: new entropyString.Random(),
    bits: entropyString.Entropy.bits(1e6, 1e9)
};

function Block(options = {}){
    _.assert({
        data: options.data
    });

    this.timestamp =    options.timestamp || this[getStamp]();
    this.data =         options.data;
    this.nonce =        options.nonce || null;
    this.hash =         options.hash || null;
    this.previousHash = options.previousHash || null;
}

Block.prototype.revalidate = function(previousHash){
    if(!this.nonce) return false;
    const hash = crypto.SHA256(previousHash + this.timestamp + this.data + this.nonce).toString()
    return this[hashIsValid](hash);
};

Block.prototype.mine = function(previousHash){

    const nonce = entropy.random.string(entropy.bits); // generate nonce
    const hash = crypto.SHA256(previousHash + this.timestamp + this.data + nonce).toString();
    let isValid = this[hashIsValid](hash); // check if new hash is valid

    if(isValid){
        this.nonce = nonce;
        this.hash = hash;
        this.previousHash = previousHash;
        return true;
    }

    return false;
};

Block.prototype[hashIsValid] = function(hash = this.hash){

    const matchString = getMatchString();
    return hash && hash.indexOf(matchString) === 0;

    function getMatchString(){
        let string = '';
        for(let i = 0; i < difficulty; i++){
            string += '0';
        }
        return string;
    }
};

Block.prototype[getStamp] = function(){
    var hrtime = process.hrtime();
    return ( hrtime[0] * 1000000 + hrtime[1] / 1000 ) / 1000;
};

module.exports = Block;