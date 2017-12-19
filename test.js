const ips = ['172.56.0.11', '172.56.0.12', '172.56.0.13', '172.56.0.14'];
const ip = '172.56.0.11';


ips.forEach((i, index) => {
    if(i === ip){
        ips.splice(index, 1)
    }
});

console.log(ips)