//const fs = require('fs');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

//read the buil json compilation result anc get the ABI of the contract
//const contract = JSON.parse(fs.readFileSync('../../versioning_contract/build/Versioning.json', 'utf8'));
//var CoursetroContract = web3.eth.contract(JSON.stringify(contract.abi));
var VersioningContract = web3.eth.contract([
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "doc",
      "outputs": [
        {
          "name": "creator",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "creation",
          "type": "uint256"
        },
        {
          "name": "version",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xf3a924e3"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "usr",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "doc",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "version",
          "type": "uint256"
        }
      ],
      "name": "ChangeDocument",
      "type": "event",
      "signature": "0x62eeefb1621987227b8e62adabb5bb51f6b7817ec78b39e5025784c181ee0c97"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "docv",
          "type": "uint256"
        }
      ],
      "name": "create",
      "outputs": [
        {
          "name": "docId",
          "type": "uint256"
        },
        {
          "name": "ver",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x9f7b4579"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "ver",
          "type": "uint256"
        },
        {
          "name": "docv",
          "type": "uint256"
        }
      ],
      "name": "update",
      "outputs": [
        {
          "name": "newVer",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x6a054250"
    }
  ]);
//console.log(contract.abi);

//contract address
var Versioning = VersioningContract.at('0x0334658Cd150d2DA479ca89cC3081791DC6e1a8C');
//console.log(Versioning);

var balance = web3.eth.getBalance(web3.eth.accounts[0]);
//console.log(balance);

Versioning.methods.create(0,234).call({ gas: 3000000 }).then(console.log);
//var inf = Versioning.create(0,234, { gas: 1000000 })
//console.log(inf[0]);
//console.log(inf[1]);

//Versioning.update(1, 0,2, { gas: 3000000 }, function(err, res){ console.log(res) });