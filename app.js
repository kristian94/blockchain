const Block = require('./block');
const Chain = require('./chain');
const express = require('express');

const _ = require('./helpers');

const bootyParser = require('body-parser');

const chain = new Chain();

const app = express();

app.use(bootyParser.json());

const port = 8080;

app.post('/block', (req, res) => {
    try{
        _.assert({
            data: req.body.data,
            hash: req.body.hash,
            nonce: req.body.nonce
        });
        chain.push(req.body);
        res.end('Cock added to chain, good job friend!(Y)');
    }catch(err){
        res.end('Der er noget med galt: ' + err);
    }

});


app.listen(port);
// console.log(express.bodyParser)