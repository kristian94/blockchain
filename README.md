Inspiration drawn from (sources)

https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54

# Missing documentation
We had completely missed the section with documentation, and we are very sorry! It was our own fault. We have been running a test scenario since wednesday 20/12 around 19:00 o'clock which can be seen on the picture.

![alt text](https://github.com/kristian94/blockchain/blob/master/img/bevis.png)

# Documentation

## The code
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

### Rest API

Our nodes communicate via Http. The Rest API can be used externally to view the chains.
their API has the following routes:

##### POST: /block
```javascript
app.post('/block', (req, res) => { 
  // New blocks are published to this endpoint
  // the response indicates wether or not the block was inserted in the chain
});
```

##### GET: /chain
```javascript
app.get('/chain', (req, res) => {
  // Returns the complete chain of the node
});
```

##### GET: /chainLength
```javascript
app.get('/chainLength', (req, res) => { 
  // returns the length of the nodes chain
});
```

### Test scenario

Our test scenario runs 4 nodes in different containers. The application has the 
ip addresses of the other nodes hardcoded, and uses these to communicate via http.

When the scenario is run, each node will initially query the other nodes for their
chain lengths chainLengths, and determine wether or not it needs to sync
with their chains (if chain lengths are different). 

When this is done the node will start generating blocks and attempt to mine these.
When a block is mined, other nodes are notified and they will add it to their chains.
Nodes will continually generate blocks and mine them, until they are terminated.

If a node becomes out of sync (eg other nodes rejects its mined block) it will 
query the nodes for their chains and replace its own chain with the longest of the
fetched ones.

Nodes will have individual difficultes, set through environment variables. The difficulty
determines how long it takes to generate a nonce, that results in a valid hash.

# Demonstration of installation & setup

The following command “bash <(curl -s http://139.59.211.36:7999/deployScript.sh)”
runs a deployment script from our server, which creates a folder to contain documents. It then downloads the required docker-compose.yml file for our system, and runs the docker-compose up command. The script assumes that you have installed docker-compose on your system.

```
read -p "Do you wish to install blockchain setup? y/n " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
mkdir blockchainsetup
cd blockchainsetup
wget http://139.59.211.36:7999/docker-compose.yml
docker-compose up -d
fi
```
In the docker-compose.yml we create a virtual network for our four nodes. 

![alt text](https://raw.githubusercontent.com/kristian94/blockchain/master/img/Screen%20Shot%202017-12-21%20at%2017.47.33.png)

We then assign the ports and ips and environmental variables for the containers.

![alt text](https://raw.githubusercontent.com/kristian94/blockchain/master/img/Screen%20Shot%202017-12-21%20at%2017.47.45.png)

When `docker-compose up` is run the you'll see the following output
![alt text](https://github.com/kristian94/blockchain/blob/master/img/Screen%20Shot%202017-12-21%20at%2018.05.36.png)

When calling our REST-API:

![alt text](https://github.com/kristian94/blockchain/blob/master/img/Screen%20Shot%202017-12-21%20at%2018.17.31.png)
