const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;
const REWARD_INPUT = {
    address: '*authorized-reward*'
};

const MINING_REWARD = 50;

const GENESIS_DATA = {
    timeStamp:'01/01/01', 
    lastHash: '--------', 
    hash:'hash-one', 
    data:[],
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY,


};
module.exports = {GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD};