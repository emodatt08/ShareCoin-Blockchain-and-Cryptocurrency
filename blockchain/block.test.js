var hexToBinary = require('hex-to-binary');
const Block = require('./block');
const {GENESIS_DATA, MINE_RATE} = require('../config');
const cryptoHash = require('../util/cryptohash');
describe('Block', () =>{
    const timeStamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const nonce = 1;
    const difficulty = 1;
    const data = ['block', 'chain'];
    const block = new Block({
          timeStamp,
          lastHash,
          hash,
          data,
          nonce,
          difficulty
    });

     it('has a timestamp, lastHash, hash, nonce, dfficulty and data properties', () => {
         expect(block.timeStamp).toEqual(timeStamp);
         expect(block.lastHash).toEqual(lastHash);
         expect(block.hash).toEqual(hash);
         expect(block.data).toEqual(data);
         expect(block.nonce).toEqual(nonce);
         expect(block.difficulty).toEqual(difficulty);
         
     });
     describe('genesis()', () =>{  
        const genesisBlock =  Block.genesis();
        it('returns a function', () =>{
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns genesis data', () =>{
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () =>{  
        const lastBlock =  Block.genesis();
        const data =  'mined data';
        const minedBlock = Block.minedBlock({lastBlock, data});


        it('returns a block instance function', () =>{
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () =>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('it sets the `data`', () =>{
            expect(minedBlock.data).toEqual(data);
        });

        it('it sets a `timestamp`', () =>{
            expect(minedBlock.timeStamp).not.toEqual(undefined);
        });

        it('creates a sha-256 `hash` based upon the proper inputs', () =>{
            expect(minedBlock.hash).toEqual(
                cryptoHash(minedBlock.timeStamp,
                           minedBlock.nonce,
                           minedBlock.difficulty, 
                           lastBlock.hash, data));
        });
        it('it  sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });

    });

    describe('adjustDifficulty()', () =>{
        it('Raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({originalBlock: block, timeStamp: block.timeStamp + MINE_RATE - 100})).toEqual(block.difficulty + 1);
        });

        it('Lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({originalBlock: block, timeStamp: block.timeStamp + MINE_RATE + 100})).toEqual(block.difficulty - 1);
        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        });
    });
     
});