const SHA256 = require("crypto-js/sha256");

class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();	
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(){
    return new Block(0, "28/01/2022", "Genesis block", "0");
  }

  getLatesBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatesBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i =1; i < this.chain.length; i++){
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

let dongliCoin = new Blockchain();
dongliCoin.addBlock(new Block(1, "28/01/2022", {amount: 4}));
dongliCoin.addBlock(new Block(2, "28/01/2022", {amount: 10}));


// 블록체인 인덱스의 1번을 직접 변조해보기
// dongliCoin.chain[1].data = { amount: 100000 };


console.log('블록들의 조작을 확인' + dongliCoin.isChainValid());
// console.log(JSON.stringify(dongliCoin, null, 4));