const express = require('express');
const Block = require('./block');
const Chain = require('./chain');
const Node = require('./nodeWrapper');

const _ = require('./helpers');

const ips = ['172.56.0.11', '172.56.0.12', '172.56.0.13', '172.56.0.14'];
const ip = process.env.ip;

if(ip === null){
    throw error('Okay det der env virkede ikke alligevel...');
}

ips.forEach((i, index) => {
    if(i === ip){
        ips.splice(index, 1)
    }
});

let currentBlock = newBlock();

ports.forEach(p => {
    if(p == port){
        // delete
    }
});

function newBlock(){
    const data = getData();

    return new Block({data});

    function getData(){
        const myArray = [
            'Man skal ikke sælge brødet før bageren er skudt',
            'Man skal ikke skue brødet på hårene',
            'Ude godt, brød til bedst',
            'Man skal ikke kaste med sten, hvis man selv er et brød',
            'Man skal bage mens ovnen er varm',
            'Bil og Campo del Militarrr',
            'Så siger jeg ikke mere om den sag',
            'Dibs på gange 8 scope',
            '*Fløjter irritenrede ind i miccen*',
            'Det blå kommer nu',
            'Hvorfor fanden kører Krissen',
            'Nu puster Borum hovedet op igen',
            'Kig efter noget benz'
        ];

        return myArray[Math.floor(Math.random() * myArray.length)];
    }
}

const nodes = ports.map(p => new Node(p));

const chain = new Chain();

const bootyParser = require('body-parser');

const app = express();

app.use(bootyParser.json());

// routes
app.post('/blockMined,', (req, res) => { // this route is called when another peer has mined a block
    const block = req.block;
    const result = chain.trySetBlockAsPending(block);
    res.end('100');
    // hvis pending findes, sender 100
    // hvis block ikke matcher prevHash, sender 200
    // hvis block er bra, sender block retur
});

app.post('/validateCurrent', (req, res) => {
    const hash = req.blocks.hash;
    if(chain.pending.hash === hash){
        res.end(hash)
    }else{
        res.end(0)
    }
});

let running = true;

const STATES = {
    MINE: 'mine',
    AWAIT_CONSENSUS: 'await',

};

let state = STATES.MINE;

function run(){
    if(state === STATE.AWAIT_CONSENSUS){
        // await consensus
        const proms = nodes.map(n => n.annonceMinedBlock(currentBlock));
        Promise.all(proms).then(res => {
            let pendingCount = res.reduce((a, r) => r === '100' ? a + 1: a, 0);
            let hashMismatchCount = res.reduce((a, r) => r === '200' ? a + 1: a, 0);


        })
    }else if(state === STATE.MINE){
        currentBlock.mine(chain.getNewestBlockHash());
        if(currentBlock.isMined()){
            state = STATE.AWAIT_CONSENSUS;
        }
        run();
    }
}



app.listen(8080);
