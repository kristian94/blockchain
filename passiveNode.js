// imports
const express = require('express');
const Block = require('./block');
const Chain = require('./chain');
const Node = require('./nodeWrapper');
const _ = require('./helpers');
const bootyParser = require('body-parser');

// ip setup
let ip = '127.0.0.2';

// nodes, chain and express
const app = express();
app.use(bootyParser.json());

// routes
app.post('/blockMined,', (req, res) => { // this route is called when another peer has mined a block
    // attempt to set recieved block as current pending
    // send back hash of new (or old) pending block, or 400 if hashMismatch

    const block = req.block;
    // const result = chain.trySetBlockAsPending(block);
    res.end(block);

});

app.post('/validateCurrent', (req, res) => {
    const hash = req.body.hash;
    res.end(hash);
});

app.listen(8080, ip, (err) => {
    console.log(err)
});