// imports
const express = require('express');
const Block = require('./block');
const Chain = require('./chain');
const Node = require('./nodeWrapper');
const _ = require('./helpers');
const bootyParser = require('body-parser');

// ip setup
const ips = ['172.56.0.11', '172.56.0.12', '172.56.0.13', '172.56.0.14'];
const ip = process.env.ip;
const difficulty = process.env.difficulty || 5;

// DEV: TEMP
// const ips = ['127.0.0.1', '127.0.0.2'];
// const ip = process.argv[2] || '127.0.0.1';
// const difficulty = process.argv[3] || 5;
// DEV: TEMP END

if(ip === null){throw error('Okay det der env virkede ikke alligevel...');}
ips.forEach((i, index) => {if(i === ip){ips.splice(index, 1)}}); // remove own ip from list




// nodes, chain and express
const nodes = ips.map(ip => new Node(ip));
let chain = new Chain();
const app = express();
app.use(bootyParser.json());

// block setup
let currentBlock = newBlock();

function newBlock(){
    const data = getData();

    return new Block({data, difficulty});

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
    RESYNC_WITH_NODES: 'resync',
    INIT: 'init'
};

let state = STATES.INIT;


// routes
app.post('/block', (req, res) => { // this route is called when another peer has mined a block
    // responds with the block if added, or the latest block in the chain if not
    const block = new Block(req.body)
    const result = chain.tryPush(block);

    res.json(result);
});

app.get('/chain', (req, res) => {
    res.json(chain.blocks)
});

app.get('/chainLength', (req, res) => {
    res.json({length: chain.blocks.length || 1});
});


// mini event loop
function run(){
    // console.log('state:', state);

    if(state === STATES.ANNONCE_MINED_BLOCK){
        // await response
        const proms = nodes.map(n => n.postBlock(currentBlock));
        Promise.all(proms).then(res => {
            const matchCount = res.reduce((a, r) => r.hash && r.hash === currentBlock.hash ? a + 1: a, 0);

            const majority = (val) => val > nodes.length / 2;
            const match = majority(matchCount);

            if(match){
                chain.tryPush(currentBlock);
                currentBlock = newBlock();
                state = STATES.MINE;
            }else {
                state = STATES.RESYNC_WITH_NODES;
            }
            run();
        }).catch(r => {
            state = STATES.RESYNC_WITH_NODES;
            setTimeout(_ => {
                run();
            }, 1)
        });
    }else if(state === STATES.MINE){
        mined = currentBlock.mine(chain.getNewestBlockHash());
        if(mined){
            state = STATES.ANNONCE_MINED_BLOCK;
        }
        setTimeout(_ => {
            run();
        }, 1);
    }else if(state === STATES.RESYNC_WITH_NODES){
        // todo
        const proms = nodes.map(n => n.getChain());
        Promise.all(proms).then(res => {
            const longestChain = res.reduce((a, c) => c.length >= a.length ? c : a, []);
            chain = new Chain();
            for(let i = 1; i < longestChain.length; i++){
                chain.tryPush(longestChain[i]);
            }
            state = STATES.MINE;
            run();
        }).catch(r => {
            console.error(r)
            state = STATES.RESYNC_WITH_NODES;
            setTimeout(_ => {
                run();
            }, 1)
        });
    }else if(state === STATES.INIT){
        const proms = nodes.map(n => n.getChainLength());
        Promise.all(proms).then(res => {
            const longestChainLength = res.reduce((a, cl) => cl > a ? cl : a , 0);
            if(longestChainLength > chain.blocks.length){
                state = STATES.RESYNC_WITH_NODES;
            }else{
                state = STATES.MINE;
            }
            run();
        }).catch(r => {
            state = STATES.RESYNC_WITH_NODES;
            setTimeout(_ => {
                run();
            }, 500)
        });
    }
}

app.listen(8080, ip, err => {
    console.log('listening on', ip,':', 8080)
    setTimeout(_ => {
        // console.log('running in 5 seconds')
        run();
    }, 5000)
});