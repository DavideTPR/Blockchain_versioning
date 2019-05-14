const fs = require('fs');
const express = require('express');
const parser = require('body-parser');
const app = express();
//web3js
const web3 = require('web3');
const web3js = new web3(new web3.providers.HttpProvider("http://127.0.0.1:7545"));


var myAddress;
var toAddress;//address to send transaction
var contractABI;//contract ABI
var contractAddress; //contract address
var contract; //the contract


//Parser for reading form data
app.use(parser.urlencoded({ extended: true })); 

//index request
app.get("/"  || "/index" || "/index.html", function(req, res){
    sendFile(res, '../client/HTML/index.html', 'text/html');
})

//subsribe request
app.get("/subscribe.html" || "/subscribe", function(req, res){
    sendFile(res, '../client/HTML/subscribe.html', 'text/html');
})

app.get("/example.html" || "/example", function(req, res){
    sendFile(res, '../client/HTML/example.html', 'text/html');
});

app.post('/example', (req, res) => {
    console.log("Get POST request");
});

//data from subscribe
app.post('/subscribe', (req, res) => {
    console.log("Get POST SUB request");
    res.send(`Full name is:${req.body.first} ${req.body.last}.`);
});

//start server
app.listen(8000, function(){
    setContract();
    console.log("Server running at http://127.0.0.1:8000/\n");

    //web3js.eth.getBalance(contractAddress).then(console.log);

    contract.methods.create(0,1).send({from: "0x6538BC49f1182844200F45cAe16c51C73452305e",   gas: 4712388, gasPrice: 100000000000}).then(console.log);
    contract.methods.update(0,0,1).call({from: "0x6538BC49f1182844200F45cAe16c51C73452305e",   gas: 4712388, gasPrice: 100000000000}).then(console.log);
});

//send file
function sendFile(response, pathPage, cont){
    fs.readFile(pathPage, function(err, page){
        response.writeHead(200, {'Content-Type': cont});
        response.write(page);
        console.log("Sending "+pathPage);
        response.end();
    });
}

//set contract information
function setContract(){
    toAddress = "http://127.0.0.1:7545";
    contractABI = [
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
  ];

    contractAddress = '0x486Dc22c4EbfB2E4F3B0790D6C64061341B0dF98';

    contract = new web3js.eth.Contract(contractABI, contractAddress);
}