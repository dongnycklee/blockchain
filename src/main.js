const {Blockchain, Transaction} =require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('4498ffbf78387f87c5543a11d808f49d764ca69262e54a066dcb042f5e7e8f3a')
const myWalletAddress = myKey.getPublic('hex');

let dongliCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, '공개키',10);
tx1.signTransaction(myKey);
dongliCoin.addTransaction(tx1);

// console.log('채굴중 1...');
// dongliCoin.addBlock(new Block(1, "28/01/2022", {amount: 4}));

// console.log('채굴중 2...');
// dongliCoin.addBlock(new Block(2, "28/01/2022", {amount: 10}));


// 블록체인 인덱스의 1번을 직접 변조해보기
// dongliCoin.chain[1].data = { amount: 100000 };


// console.log('블록들의 조작을 확인' + dongliCoin.isChainValid());
// // console.log(JSON.stringify(dongliCoin, null, 4));
// dongliCoin.createTransaction(new Transaction('address1', 'address2', 100));
// dongliCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n 채굴을 시작합니다...');
dongliCoin.minePendingTransactions('dongdong-address');


console.log('\n 지갑의 잔액은', dongliCoin.getBalanceOfAddress('dongdong-address'));

console.log('\n 채굴을 시작합니다...진행중...');
dongliCoin.minePendingTransactions(myWalletAddress);


console.log('\n 지갑의 잔액은', dongliCoin.getBalanceOfAddress(myWalletAddress));

console.log('유효한 체인인가?', dongliCoin.isChainValid());