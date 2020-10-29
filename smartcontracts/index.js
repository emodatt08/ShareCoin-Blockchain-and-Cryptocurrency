const request = require('request');
let Blockchain = require('../blockchain');
let partialMessage;

class FuturesContract{

    constructor([transaction, ticker, maturityDate]){
        this.transaction = transaction;
        this.ticker = ticker;
        this.contractMap = new Map();
        this.maturityDate = maturityDate;


    }

    getTickerPrice(){
        this.connect(this.ticker);
        if(this.partialMessage){
            return JSON.parse(this.partialMessage).open;
        }else{
            return null;
        }
        
    }

    setFuturesContract(){
        if(this.maturityDate === getTodaysDate()){
            if(this.transaction.amount === this.getTickerPrice()){
                //add block
                Blockchain.addBlock(this.transaction); 
                //add to futures contract map
                this.contractMap.set(this.transaction.publicKey, JSON.stringify(this.transaction));
            }else{
                return null
            }
        }
       

    }

    getTodaysDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm  + '-' + dd;
        return today;
    }

    getFuturesContract(){
       return  this.contractMap.set(this.transaction.publicKey);
    }

     connect(ticker) {
        stream = request({
            url: 'https://cloud.iexapis.com/stable/stock/'+ticker+ 'aapl/quote?token=MY_TOKEN_HERE',
            headers: {
                'Content-Type': 'text/event-stream'
            }
        })
        this.streamerFunction(stream);
        this.wait();
    }

    streamerFunction(stream){
        stream.on('socket', () => {
            console.log("Connected");
        });
        
        stream.on('end', () => {
            console.log("Reconnecting");
            this.connect();
        });
        
        stream.on('complete', () => {
            console.log("Reconnecting");
            this.connect();
        });
        
        stream.on('error', (err) => {
            console.log("Error", err);
            this.connect();
        });
        
        stream.on('data', (response) => {
            var chunk = response.toString();
            var cleanedChunk = chunk.replace(/data: /g, '');
        
            if (partialMessage) {
                cleanedChunk = partialMessage + cleanedChunk;
                partialMessage = "";
            }
        
            var chunkArray = cleanedChunk.split('\r\n\r\n');
        
            chunkArray.forEach(function (message) {
                if (message) {
                    try {   
                        var quote = JSON.parse(message)[0];
                        console.log(quote);
                    } catch (error) {
                        this.partialMessage = message;
                    }
                }
            });
        });
    }
    
    
   
    
     wait () {
        setTimeout(wait, 1000);
    }
    
  
}

module.exports =  FuturesContract;