// imports
const express = require('express');
const Block = require('./block');
const Chain = require('./chain');
const Node = require('./nodeWrapper');
const _ = require('./helpers');
const bootyParser = require('body-parser');

// ip setup
// const ips = ['172.56.0.11', '172.56.0.12', '172.56.0.13', '172.56.0.14'];
// const ip = process.env.ip;

// DEV: TEMP
const ips = ['127.0.0.1', '127.0.0.2'];
const ip = '127.0.0.1';
// DEV: TEMP END

if(ip === null){throw error('Okay det der env virkede ikke alligevel...');}
ips.forEach((i, index) => {if(i === ip){ips.splice(index, 1)}}); // remove own ip from list


// nodes, chain and express
const nodes = ports.map(p => new Node(p));
const chain = new Chain();
const app = express();
app.use(bootyParser.json());

// block setup
let currentBlock = newBlock();

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

// state machine

const STATES = {
    MINE: 'mine',
    ANNONCE_MINED_BLOCK: 'annonce',
    AWAIT_VALIDATION: 'await',
    RESYNC_WITH_NODES: 'resync'
};

let state = STATES.MINE;


// routes
app.post('/blockMined,', (req, res) => { // this route is called when another peer has mined a block
    // attempt to set recieved block as current pending
    // send back hash of new (or old) pending block, or 400 if hashMismatch
    const block = req.body;
    const result = chain.trySetBlockAsPending(block);

    res.end(result);
});

app.post('/validateCurrent', (req, res) => {
    const hash = req.body.hash;
    if(chain.pending.hash === hash){
        res.end(hash)
    }else{
        res.end(0)
    }
});

app.post('/blockAddedToChain', (req, res) => {
    const hash = req.body.hash;
    if(chain.pending.hash === hash){
        chain.addPendingBlockToChain();
    }else{

    }
});


// mini event loop

function run(){
    console.log('state:', state);

    if(chain.pending !== null){
        state = STATES.AWAIT_VALIDATION
    }

    if(state === STATES.ANNONCE_MINED_BLOCK){
        // await response
        const proms = nodes.map(n => n.annonceMinedBlock(currentBlock));
        Promise.all(proms).then(res => {
            const matchCount = res.reduce((a, r) =>         r.hash && r.hash === currentBlock.hash ? a + 1: a, 0);
            const diffPendingCount = res.reduce((a, r) =>   r.hash && r.hash !== currentBlock.hash ? a + 1: a, 0);
            const mismatchCount = res.reduce((a, r) =>      r === '400' ? a + 1: a, 0);


            const majority = (val) => val > nodes.length / 2;
            const match = majority(matchCount);
            const diffPending = majority(diffPendingCount);
            const misMatch = majority(mismatchCount);

            if(match){
                state = STATES.AWAIT_VALIDATION
            }else if(diffPending){
                state = STATES.RESYNC_WITH_NODES
            }else if(misMatch){
                state = STATES.RESYNC_WITH_NODES
            }
            run();
        })
    }else if(state === STATES.MINE){
        currentBlock.mine(chain.getNewestBlockHash());
        if(currentBlock.isMined()){
            state = STATES.ANNONCE_MINED_BLOCK;
        }
        run();
    }else if(state === STATES.RESYNC_WITH_NODES){
        // todo
        console.log('Tried to resync, but not implemented yet')
    }else if(state === STATES.AWAIT_VALIDATION){
        const proms = nodes.map(n => n.validateBlock(currentBlock));
        Promise.all(proms).then(res => {
            const matches = res.reduce((a, r) =>   r && r === currentBlock.hash ? a + 1: a, 0);
            const majority = (val) => val > nodes.length / 2;

            if(majority(matches)){
                chain.addPendingBlockToChain();
            }else{


            }
        });
    }
}

app.listen(8080, ip, err => {
    run();
});