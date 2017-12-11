const Block = require('./block');
const _ = require('./helpers');

const printChain = Symbol();


// Chain constructor.. opretter en genesis block og sætter som først
function Chain(){
    const block = makeGenesisBlock();
    this.blocks = [block];
    this.indexes = new Map();
    this.unmined = new Set();

    function makeGenesisBlock(){
        const block = new Block({
            data: "63N3212",
            previousHash: ''
        });
        block.hash = "0000be236d75dec09051d4ce707c3635d098e584fad0fcb4e88dd0e6f85efec8";
        block.nonce = 'tfFP8DLR3TNT64';
        return block;
    }
}

Chain.prototype.push = function(block){
    const conflict = this.blocks[this.blocks.length - 1].timestamp > block.timestamp;

    if(!conflict){
        const blockIndex = this.blocks.push(block) - 1;
        block.chain = this;
        // indexing the block for quick lookups
        this.indexes.set(block._id, blockIndex);
        if(!block.isMined()){
            this.unmined.add(block._id);
        }
        block.previousHash = this.getNewestBlockHash();
    }else{
        const blockInArray = this.blocks.pop();
        this.unmined.delete(blockInArray._id);
        const sorted = [block, blockInArray].sort((a, b) => {
            return a.timestamp - b.timestamp
        });
        sorted.forEach(b => {

            this.push(b);
        });
    }
};

Chain.prototype.getNewestBlockHash = function(){
    const len = this.blocks.length;
    return this.blocks[len - 1].hash;
};

Chain.prototype.updateBlock = function(block){
    const index = this.indexes.get(block._id);
    const nextIndex = index + 1;
    const prevBlock = index - 1 >= 0 ? this.blocks[index - 1] : null;
    const prevHash = prevBlock ? prevBlock.hash : '';

    const updated = this.blocks[index].tryUpdate(block.hash, block.nonce);
    if(!block.previousHash) block.previousHash = prevHash;

    this.unmined.delete(block._id);

    if(updated && nextIndex < this.block.length){
        // tryUpdate next block
        const nextBlock = this.blocks[nextIndex];
        this.updateBlock(nextBlock);
    }
};

Chain.prototype.getBlock = function(id){
    const index = this.indexes.get(id);
    return this.blocks[index];
};

Chain.prototype.getNextUnmined = function(){
    const id = this.unmined.values().next().value;
    const index = this.indexes.get(id);
    return this.blocks[index];
};

Chain.prototype.print = function () {
    this.blocks.forEach(b => console.log(b.data, b.timestamp))
};

module.exports = Chain;