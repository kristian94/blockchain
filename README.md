# Installation:

## On your designated Linux system;

bash <(curl -s http://139.59.211.36:7999/deployScript.sh)



Inspiration drawn from (sources)

https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54

### Documentation

The main Object types we use are Chain and Block:

#### Block
```javascript
// Constructor for the block Object
function Block(options = {}){
    _.assert({
        data: options.data
    });

    this.timestamp =    options.timestamp || this[getStamp]();
    this.data =         options.data;
    this.nonce =        options.nonce || null;
    this.hash =         options.hash || null;
    this.previousHash = options.previousHash || null;
    this.difficulty =   Number(options.difficulty) || 5;
}

Block.prototype.revalidate = function(previousHash){
  // revalidates the block, that is, reruns the hashing algorithm to ensure it produces
  // a valid hash, relative to the blocks set difficulty
}

Block.prototype.mine = function(previousHash){
  // attempts to mine the block eg generates a new nonce and runs the hashing algorithm.
  // returns a boolean, indicating the success of the attempt
}

Block.prototype.hashIsValid = function(hash){
  // private function for checking if a hash is valid, based on the block difficulty
}

Block.prototype.getStamp = function(){
  // returns a newly generated timestamp with the current time, invoked from the constructor
}
```

#### Chain
```javascript
// constructor for the Chain object
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

Chain.prototype.tryPush = function(block){
  // tries to push the input block to the chain. If the blocks previousHash doesnt match
  // the chains newest block, it will not push
  // Returns the input block if pushed, or else the newest block in the chain
}

Chain.prototype.getNewestBlockHash = function(){
  // returns the hash of the newest block in the chain
}
```
