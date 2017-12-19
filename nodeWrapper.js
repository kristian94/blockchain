const axios = require('axios');

function Node(port){
    this.port = port;

}

Node.prototype.annonceMinedBlock = function(block){
    return axios.post(this.url('/blockMined'), block)
};

Node.prototype.validateBlock = function(){
    return axios.post(this.url('/validateCurrent'), block)
};

Node.prototype.url = function(path){
    return `${this.ip.get()}:${this.port}${path}`;
};

Node.prototype.ip = (function(){
    let ip = '127.0.0.1';

    return {
        get(){
            return ip
        },
        set(_ip){
            ip = _ip;
        }
    }
})();

module.exports = Node;