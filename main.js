const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    /*
        index: the position of the block on the chain
        timestamp: when the block is created
        transactions: any type of transactions associated to the block (this is of type object)
        previousHash: a string that contains the hash of the block before the current one
    */
    constructor(timestamp, transactions, previousHash = ''){
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
          }
        console.log("Block mined: " + this.hash);
    }
}



class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()]; //the chain of block, first block is the Genesis block
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("10/02/2021", "Genesis block", "0");
    }

    getLatestBlock () {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block =  new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block succesfully mined!')
        this.chain = [...this.chain, block];

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions = [...this.pendingTransactions, transaction];
    }
    
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i ++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let bitcoin = new Blockchain();
bitcoin.createTransaction(new Transaction('address1', 'address2', 100));
bitcoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
bitcoin.minePendingTransactions('jack-address');

console.log('\nBalacne of jack is', bitcoin.getBalanceOfAddress('jack-address'));