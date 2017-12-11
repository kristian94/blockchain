const express = require('express');
const Block = require('./block');
const Chain = require('./chain');
const _ = require('./helpers');

const chain = new Chain();

const bootyParser = require('body-parser');

const app = express();

app.use(bootyParser.json());

// routes
app.post('/block/add', (req, res) => {
    try{
        const block = new Block(req.data, req.previousHash);
        const result = chain.push(req.body);

        res.end('Cock added to chain, good job friend!(Y)');
    }catch(err){
        res.end('Der er noget med galt: ' + err);
    }
});

app.post('/block/mined,', (req, res) => { // this route is called when another peer has mined a block
    const block = Block.prototype.fromDTO(req.block);

});

const port = 8080;

app.listen(port);
