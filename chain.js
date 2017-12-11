const Block = require('./block');

const printChain = Symbol();

function Chain(){
    const blockData = "my genesis block!!";
    const blockHash = "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7";
    const block = new Block(blockData, blockHash);
    block.index = 0;

    this.array = [block];
}

Chain.prototype.push = function(block){
    block.index = this.array.length;
    block.previousHash = this.array[this.array.length-1].hash;

    this.array.push(block);
    this[printChain]();
};

Chain.prototype.get = function(){
    return this.array;
};

// Chain.prototype.reserveIndex = function(){
//
//
// };

Chain.prototype[printChain] = function(){
    console.log('Chain changed');
    console.log(this.array);
};

module.exports = Chain;