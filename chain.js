const Block = require('./block');
const _ = require('./helpers');

const printChain = Symbol();


// Chain constructor.. opretter en genesis block og sætter som først
function Chain(){
    const block = makeGenesisBlock();
    this.blocks = [block];
    this.unmined = new Map();
    
    function makeGenesisBlock(){
        const block = new Block("Krissen er missen", '');
        block.hash = "0000be236d75dec09051d4ce707c3635d098e584fad0fcb4e88dd0e6f85efec8";
        block.nonce = 'tfFP8DLR3TNT64';
        return block;
    }
}

Chain.prototype.push = function(block){
    const conflict = block.previousHash !== this.getNewestBlockHash();

    if(!conflict){
        const newLength = this.blocks.push(block);
        this.unmined[block._id] = newLength - 1;
    }else{
        const blockInArray = this.blocks.pop();
        const sorted = [block, blockInArray].sort((a, b) => {
            return a.timestamp - b.timestamp
        });
        sorted.forEach(b => {
            b.previousHash = this.getNewestBlockHash();
            this.push(b);
        });
    }
};

Chain.prototype.getNewestBlockHash = function(){
    const len = this.blocks.length;
    return this.blocks[len - 1].hash;
};

Chain.prototype.updateMinedBlock = function(block){

};

Chain.prototype.get = function(){
    return this.blocks;
};

Chain.prototype.getUnmined = function(){
    return this.blocks.filter(b => b.isMined())
};

Chain.prototype.print = function () {
    console.log('Chain:', this.blocks);
    console.log('Unmined blocks:', this.getUnmined());
};

module.exports = Chain;