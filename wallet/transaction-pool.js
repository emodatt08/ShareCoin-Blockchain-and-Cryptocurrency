const Transaction = require('./transaction');

class TransactionPool{

    constructor(){
        this.transactionMap = {};
    }

    /**
     * clears transactions after completion
     */

    clear(){
        this.transactionMap = {};
    }

    /**
     * adds a transaction
     * @param {*} transaction 
     */

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;

    }
    /**
     * returns an existing transaction given an input address
     * @param {*} inputAddress 
     */
    existingTransaction({inputAddress}){
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === inputAddress);
        }
    /**
     * Sync transaction pool map by setting the map at the root of a new instance
     * @param {*} transactionMap 
     */
    setMap(transactionMap){
        this.transactionMap = transactionMap;
    }
    /**
     * filter to get only valid transactions
     */
    validTransactions(){
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        );
    }

    /**
     * clears the pool of any existing blockchain transactions
     * @param {*} param0 
     */
    clearBlockchainTransactions({ chain }) {
        for (let i=1; i<chain.length; i++) {
          const block = chain[i];
    
          for (let transaction of block.data) {
            if (this.transactionMap[transaction.id]) {
              delete this.transactionMap[transaction.id];
            }
          }
        }
      }

}

module.exports = TransactionPool;