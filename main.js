const SHA256 = require('crypto-js/sha256');

class Block {
    /*
        index: the position of the block on the chain
        timestamp: when the block is created
        data: any type of data associated to the block (this is of type object)
        previousHash: a string that contains the hash of the block before the current one
    */
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.data = data;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
    }

    createGenesisBlock(){
        return new Block(0, "10/02/2021", "Genesis block", "0");
    }

    getLatestBlock () {
        return this.chain[this.chain.length - 1];
    }

    addBlock (newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)
        this.chain = [...this.chain, newBlock];
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

console.log('Mining block 1 ...');
bitcoin.addBlock(new Block(1, "10/02/2021", { amount: 4 }));
console.log('Mining block 2 ...');
bitcoin.addBlock(new Block(2, "12/02/2021", { amount: 8 }));


