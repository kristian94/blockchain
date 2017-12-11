const crypto = require('crypto-js');
const entropyString = require('entropy-string');
const _ = require('./helpers');

const difficulty = 4; // number of zeroes a hash should start with

const hashIsValid = Symbol(); // private functions

const entropy = { // used for generating nonces
    random: new entropyString.Random(),
    bits: entropyString.Entropy.bits(1e6, 1e9)
};

function Block(options){
    _.assert({
        data: options.data,
        previousHash: options.previousHash
    });

    this._id =          options._id || entropy.random.string(entropy.bits);
    this.timestamp =    options.timestamp || new Date().getTime();
    this.data =         options.data;
    this.previousHash = options.previousHash;
    this.nonce =        options.nonce || null;
    this.hash =         options.hash || null;
}

Block.prototype.mine = function(){
    let isValid = this[hashIsValid]();
    while(!isValid){
        const nonce = entropy.random.string(entropy.bits); // generate nonce
        const hash = crypto.SHA256(this.previousHash + this.timestamp + this.data + nonce).toString();
        isValid = this[hashIsValid](hash); // check if new hash is valid
        if(isValid){
            this.nonce = nonce;
            this.hash = hash;
        }
    }
};

Block.prototype.update = function(hash, nonce){
    _.assert(hash, nonce);

    // sikkerhed - måske lidt overkill?
    // const confirmationHash = crypto.SHA256(this.previousHash + this.timestamp + this.data + nonce).toString();
    // if(hash !== confirmationHash){
    //     throw new Error(`Block was not able to replicate hash with nonce [${nonce}]`);
    // }

    this.nonce = nonce;
    this.hash = hash;
};

Block.prototype.isMined = function(){
    return !_.isNull(this.nonce) && this[hashIsValid]();
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

Block.prototype.toDTO = function(){
    return {
        _id: this._id,
        data: this.data,
        hash: this.hash,
        previousHash: this.previousHash,
        nonce: this.nonce,
        timestamp: this.timestamp
    }
};

// Block.prototype.fromDTO = function(dto){
//     const block = new Block(dto.data, dto.previousHash);
//     block.nonce = dto.nonce;
//     block.timestamp = dto.timestamp;
//     block.hash = dto.hash;
//     return block;
// };

Block.prototype.toString = function(){
    return this.hash;
};

module.exports = Block;