const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const {cryptoHash} = require('../util');
const {REWARD_INPUT, MINING_REWARD} = require('../config');
class Blockchain{

    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({ data }){
        const newBlock = Block.minedBlock({
            lastBlock:this.chain[this.chain.length-1],
            data
        });
        
        this.chain.push(newBlock);
    }
    
    // validTransactionData({chain}){
    //     for(let i=1; i < chain.length; i++){
    //         const block = chain[i];
    //         const transactionSet = new Set();
    //         let rewardTransactionCount = 0;
    //         for(let transaction of block.data){
    //             if(transaction.input.address === REWARD_INPUT.address){
    //                 rewardTransactionCount += 1;
    //                 if(rewardTransactionCount > 1){
    //                     console.error('Miner rewards exceed limit');
    //                     return false;
    //                 }

    //                 if(Object.values(transaction.outputMap)[0]  !== MINING_REWARD){
    //                     console.error('Miner reward amount is invalid');
    //                     return false;
    //                 }
    //             }else{
    //                 if(!Transaction.validTransaction(transaction)){
    //                     console.error('Invalid Transaction');
    //                     return false;
    //                 } 

    //                 const trueBalance = Wallet.calculateBalance({
    //                     chain: this.chain,
    //                     address: transaction.input.address
    //                 });

    //                 if(transaction.input.amount !== trueBalance){
    //                     console.error('Invalid input amount');
    //                     return false;
    //                 }
    //                 if(transactionSet.has(transaction) ){
    //                     console.error('An identical transaction appears more than once in the block');
    //                     return false;
    //                 }else{
    //                     transactionSet.add(transaction);
    //                 }
    //             }
    //         }
    //     }
    //     return true;
    // }

    validTransactionData({ chain }) {
        for (let i=1; i<chain.length; i++) {
          const block = chain[i];
          const transactionSet = new Set();
          let rewardTransactionCount = 0;
    console.log(block);
          for (let transaction of block.data) {
            if (transaction.input.address === REWARD_INPUT.address) {
              rewardTransactionCount += 1;
    
              if (rewardTransactionCount > 1) {
                console.error('Miner rewards exceed limit');
                return false;
              }
    
              if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                console.error('Miner reward amount is invalid');
                return false;
              }
            } else {
              if (!Transaction.validTransaction(transaction)) {
                console.error('Invalid transaction');
                return false;
              }
    
              const trueBalance = Wallet.calculateBalance({
                chain: this.chain,
                address: transaction.input.address
              });
    
              if (transaction.input.amount !== trueBalance) {
                console.error('Invalid input amount');
                return false;
              }
    
              if (transactionSet.has(transaction)) {
                console.error('An identical transaction appears more than once in the block');
                return false;
              } else {
                transactionSet.add(transaction);
              }
            }
          }
        }
    
        return true;
      }

    replaceChain(chain, validateTransactions, onSuccess){
        if(chain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }else if(!Blockchain.isValidChain(chain)){
            console.error('The incoming chain must be valid');
            return;
        }
        if(validateTransactions && !this.validTransactionData({chain})){
            console.error('The Incoming chain has invalid data');
        }
        if(onSuccess) onSuccess();
        console.error('replacing chain with', chain);
        this.chain = chain;
    }
    /**
     * Checks if the chain has remained valid
     * @param {array} chain 
     */
    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }

        for(let i =1; i<chain.length; i++){
            const {data, difficulty,hash,lastHash,nonce,timeStamp} = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if(lastHash !== actualLastHash )return false;
            
            const validatedHash = cryptoHash(timeStamp, lastHash, data, nonce, difficulty);
            if(hash !== validatedHash) return false;
            //if(hash.toLowerCase() === validatedHash.toLowerCase()) return true;
            if((lastDifficulty - difficulty) > 1) return false        
        }

        return true;
    }
}

module.exports =  Blockchain;