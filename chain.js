const Block = require('./block');

function Chain(){
    const block = makeGenesisBlock();
    this.blocks = [block];
    this.pending = null;

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

// if pushed, returns the block. If not, returns the newest block in the chain
Chain.prototype.tryPush = function(block){
    if(!block.revalidate){
        block = new Block(block)
    }

    const prevHash = this.getNewestBlockHash();
    if(block.previousHash === prevHash && block.revalidate(prevHash)){
        this.blocks.push(block);
        return block;
    }else{
        return this.blocks[this.blocks.length - 1];
    }
};

// Chain.prototype.trySetBlockAsPending = function(block){
//     if(this.pending !== null){
//         return this.pending
//     }else if(this.pending.previousHash !== this.blocks[this.blocks.length - 1].hash){
//         return 400
//     }
//
//     this.pending = block;
//     return this.pending;
// };

// Chain.prototype.addPendingBlockToChain = function(block = this.pending){
//     if(this.pending !== null){
//         return;
//     }
//     let block = this.pending;
//     this.pending = null;
//     this.blocks.push(block);
// };

Chain.prototype.getNewestBlockHash = function(){
    return this.blocks[this.blocks.length - 1].hash;
};

module.exports = Chain;