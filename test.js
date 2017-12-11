const Block = require('./block');
const Chain = require('./chain');
const chain = new Chain();

const blocks = [];






const blockA = new Block({
    data: 'første'
});

const blockB = new Block({
    data: 'anden'
});

const blockC = new Block({
    data: 'tredje'
});

const blockD = new Block({
    data: 'fjerde'
});

const blockE = new Block({
    data: 'femte'
});

chain.push(blockD);

chain.push(blockB);

chain.push(blockC);

chain.push(blockE);

chain.push(blockA);


chain.getNextUnmined().mine();

chain.getNextUnmined().mine();

chain.getNextUnmined().mine();

chain.getNextUnmined().mine();

chain.getNextUnmined().mine();




chain.print();






