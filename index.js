const bodyParser = require('body-parser');
const express  = require('express');
const request = require('request');
const path = require('path');
const util = require("util");
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool});
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://5.189.172.153:${DEFAULT_PORT}`
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub});

const isDevelopment = process.env.ENV === 'development';
//const isDevelopment = true;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));


app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  

/**
 * Get all blocks in a chain
 * 
 */
app.get('/api/blocks', (req, res)=>{
    //all blocks in a chain
    res.json(blockchain.chain);
});
/**
 * get all mined transactions
 */
app.get('/api/transaction/pool/map', (req, res)=>{
    res.json(transactionPool.transactionMap);
})

/**
 * mine all pending transactions
 */
app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
  
    res.redirect('/api/blocks');
  });


/**
 * Get all data in the transaction pool
 */
app.get('/api/transact/pool', (req, res)=>{

    //all data in the transaction pool
    res.json(transactionPool.transactionMap);
});

/**
 * This allows the requestor to officially perform a transaction
 */
app.post('/api/transact', (req, res)=>{
     //get amount and recipient
     const {amount, recipient} = req.body;
     let transaction = transactionPool.existingTransaction({inputAddress: wallet.publicKey});
    try{
        if(transaction){
            transaction.update({senderWallet: wallet,recipient, amount});
        }else{
            //create a transaction
            transaction = wallet.createTransaction({recipient, amount, chain:blockchain.chain});
        }
        
    }catch(e){
       return res.status(400).json({type:'error', message: e.message});
    }
   
    //set transaction in pool
    transactionPool.setTransaction(transaction);
    //broadcast transactions to peers
    pubsub.broadcastTransaction(transaction);
    //returns the transaction performed
    res.json({type:'success',transaction});
});




/**
 *This allows a user to mine a block
 */
app.post('/api/mine', (req, res)=>{
    //get data from request
    const {data} = req.body;

    //var_dump(res, {data});
    //send data to block
    blockchain.addBlock({data});
    //broadcast to peers
    pubsub.broadcastChain();
    //redirect to all blocks in a chain
    res.redirect('/api/blocks');
});

/**
 * Get all info belonging to a wallet owner 
 */
app.get('/api/wallet/info', (req, res)=>{
    const address = wallet.publicKey
    res.json({
        address,
        balance: Wallet.calculateBalance({chain: blockchain.chain, address})
    });
});

/**
 * Get index 
 */
app.get('*', (req, res)=>{
   res.sendFile(path.join(__dirname,'client/dist/index.html'));
});

const syncWithRootState = () =>{
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) =>{
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync with', rootChain)
            blockchain.replaceChain(rootChain);
        }
    });

    request({url: `${ROOT_NODE_ADDRESS}/api/transact/pool`}, (error, response, body) => {
        if(!error && response.statusCode === 200){
            const rootTransactionPoolMap = JSON.parse(body);
            console.log('replacing the transaction pool map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};


if (isDevelopment) {
    const walletFoo = new Wallet();
    const walletBar = new Wallet();
  
    const generateWalletTransaction = ({ wallet, recipient, amount }) => {
      const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
      });
  
      transactionPool.setTransaction(transaction);
    };
  
    const walletAction = () => generateWalletTransaction({
      wallet, recipient: walletFoo.publicKey, amount: 5
    });
  
    const walletFooAction = () => generateWalletTransaction({
      wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
    });
  
    const walletBarAction = () => generateWalletTransaction({
      wallet: walletBar, recipient: wallet.publicKey, amount: 15
    });
  
    for (let i=0; i<20; i++) {
      if (i%3 === 0) {
        walletAction();
        walletFooAction();
      } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
      } else {
        walletFooAction();
        walletBarAction();
      }
  
      transactionMiner.mineTransactions();
    }
  }

let PEER_PORT;


if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = (PEER_PORT ? PEER_PORT: DEFAULT_PORT);
app.listen(PORT,() => {
    console.log(`Listening to localhost:${PORT}`);
    if(PORT !== DEFAULT_PORT){
        syncWithRootState();
    }
    
})