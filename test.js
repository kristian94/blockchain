const Node = require('./nodeWrapper');

const node = new Node('127.0.0.1');


// node.getChainLength().then(r => {
//     console.log(r)
// });

// node.getChain().then(r => {
//     console.log(r)
// })
//
node.postBlock({hash: '1234'}).then(r => {
    console.log(r)
})