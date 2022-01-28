const SHA256 = require("crypto-js/sha256");

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block{
  constructor(timestamp, transactions, previousHash = ''){
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
  }

    console.log("블록채굴:" +this.hash);
  }
}


class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions =[];
    this.miningReward = 100;
  }

  createGenesisBlock(){
    return new Block("28/01/2022", "Genesis block", "0");
  }

  getLatesBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('블록 채굴 완료!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
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

    return balance;
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


// console.log('채굴중 1...');
// dongliCoin.addBlock(new Block(1, "28/01/2022", {amount: 4}));

// console.log('채굴중 2...');
// dongliCoin.addBlock(new Block(2, "28/01/2022", {amount: 10}));


// 블록체인 인덱스의 1번을 직접 변조해보기
// dongliCoin.chain[1].data = { amount: 100000 };


// console.log('블록들의 조작을 확인' + dongliCoin.isChainValid());
// console.log(JSON.stringify(dongliCoin, null, 4));
dongliCoin.createTransaction(new Transaction('address1', 'address2', 100));
dongliCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n 채굴을 시작합니다...');
dongliCoin.minePendingTransactions('dongdong-address');


console.log('\n 지갑의 잔액은', dongliCoin.getBalanceOfAddress('dongdong-address'));

console.log('\n 채굴을 시작합니다...진행중...');
dongliCoin.minePendingTransactions('dongdong-address');


console.log('\n 지갑의 잔액은', dongliCoin.getBalanceOfAddress('dongdong-address'));