const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash(){
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingKey){
    if(signingKey.getPublic('hex') !== this.fromAddress){
      throw new Error('다른 지갑에 대한 거래에 서명할 수 없습니다!');
    }
    
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  isValid(){
    if(this.fromAddress === null) return true;

    if(!this.signature || this.signature.length === 0){
      throw new Error('이 트랜잭션에 서명이 없습니다!');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
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

  hasValidTransaction(){
    for(const tx of this.transactions){
      if(!tx.isValid()){
        return false;
      }
    }

    return true;
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

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash); 
    block.mineBlock(this.difficulty);

    console.log('블록 채굴 완료!');
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(transaction){

    if(!transaction.fromAddress || !transaction.toAddress){
      throw new Error('트랜잭션은 발신 및 수신 주소를 포함해야 합니다.');
    }

    if(!transaction.isValid()){
      throw new Error('체인에 잘못된 트랜잭션을 추가할수 없습니다.');
    }

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

      if(!currentBlock.hasValidTransaction()){
        return false;
      }

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



module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;