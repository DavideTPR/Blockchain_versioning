/*import Web3 from 'web3';

const net = require('net');
//const web3 = new new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); //connect with contract

function connect(){

}*/
const fs = require('fs');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

//read the buil json compilation result anc get the ABI of the contract
const contract = JSON.parse(fs.readFileSync('../../versioning_contract/build/Versioning.json', 'utf8'));
var CoursetroContract = web3.eth.contract(JSON.stringify(contract.abi));

//contract address
var Coursetro = CoursetroContract.at('0x0334658Cd150d2DA479ca89cC3081791DC6e1a8C');