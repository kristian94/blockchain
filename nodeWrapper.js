const axios = require('axios');

function Node(ip){
    this.port = 8080;
    this.ip = ip;
    this.isLive = true;
}

Node.prototype.postBlock = function(block){
    console.log('postBlock to', this.url('/block'))
    return axios(this.url('/block'), {
        method: 'post',
        data: block
    }).then(res => {
        return res.data
    })
    //     .catch(res => {
    //     return Promise.resolve(block)
    // })
};

Node.prototype.getChain = function(){
    console.log('getChain')
    return axios(this.url('/chain'), {
        method: 'get'
    }).then(res => {
        return res.data
    })
    //     .catch(res => {
    //     return Promise.resolve([])
    // })
};

Node.prototype.getChainLength = function(){
    console.log('getChainLength')
    return axios(this.url('/chainLength'), {
        method: 'get'
    }).then(res => {
        return res.data.length
    })
    //     .catch(r => {
    //     return Promise.resolve(1)
    // })
};

Node.prototype.url = function(path){
    return `http://${this.ip}:${this.port}${path}`;
};

module.exports = Node;