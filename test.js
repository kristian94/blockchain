const Block = require('./block');
const Chain = require('./chain');
const chain = new Chain();

const blocks = [];



const nextHash = chain.getNewestBlockHash();

// vi simulerer to blocke der bliver instantieret med samme previousHash

const blockA = new Block({
    data: 'første',
    previousHash: nextHash
});

const blockB = new Block({
    data: 'anden',
    previousHash: nextHash
});

const blockC = new Block({
    data: 'tredje',
    previousHash: nextHash
});

chain.push(blockC);

chain.push(blockB);

chain.push(blockA);

chain.getNextUnmined().mine();

chain.getNextUnmined().mine();

chain.getNextUnmined().mine();

chain.print();






