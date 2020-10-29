const lightningHash = (data) =>{
    return data + "*";
}

const makeFullHash = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

class Block{
    constructor(data, hash, previousHash){
        this.hash = hash;
        this.data = data;
        this.previousHash = previousHash;
    }
  
}

class BlockChain{
    constructor(){
        this.chain = [];
        const genesis = new Block('gen-data','gen-hash', 'gen-lastHash');
        this.chain = [genesis];    
    }

    addBlock(data){
        //lastHash is the hash of the previous block
        const lastHash = this.chain[this.chain.length-1].hash;
        //hash is the hash of the current block
        const hash = lightningHash(data + lastHash);
        //add a new block
        const block = new Block(data, hash, lastHash);
        //add the block to the chain
        this.chain.push(block);
    }
}

// const fooBlock = new Block('foo-data', '2355tetees8876&&', '5343445527&&89');
// console.log(fooBlock);

const fooBlockChain = new BlockChain();
fooBlockChain.addBlock('oneInfo');
fooBlockChain.addBlock('twoInfo');
fooBlockChain.addBlock('threeInfo');
fooBlockChain.addBlock('fourInfo');

console.log(fooBlockChain);