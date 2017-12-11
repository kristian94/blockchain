const exp = {};

exp.assert = function(obj){
    const invalids = [];
    exp.objEach(obj, (key, value) => {
        if(exp.isNull(value)){
            invalids.push(key);
        }
    });
    if(invalids.length > 0){
        const errorString = `Following keys was invalid: [${invalids.join(', ')}]`;
        throw new Error(errorString);
    }

};

exp.objEach = function(obj, func){
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            func(key, obj[key])
        }
    }
}

exp.isNull = function(val){
    return (val === null || val === undefined)
};


module.exports = exp;