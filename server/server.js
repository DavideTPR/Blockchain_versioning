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

var readUser; //user of the system

function User(first, last, password, wallet){
  this.first = first;
  this.last = last;
  this.password = password;
  this.wallet = wallet;
}


//Parser for reading form data
app.use(parser.urlencoded({ extended: true })); 

/* G E T  R E Q U E S T */

//index request
app.get("/"  || "/index" || "/index.html", function(req, res){
    sendFile(res, '../client/HTML/index.html', 'text/html');
})

//subscribe request
app.get("/subscribe.html" || "/subscribe", function(req, res){
    sendFile(res, '../client/HTML/subscribe.html', 'text/html');
})

//example request
app.get("/example.html" || "/example", function(req, res){
    sendFile(res, '../client/HTML/example.html', 'text/html');
});



/* P O S T  R E Q U E S T */
app.post('/example', (req, res) => {
    console.log("Get POST request");
});

//data from subscribe
app.post('/subscribe', (req, res) => {
    console.log("Get POST SUB request");
    res.send(`Full name is:${req.body.first} ${req.body.last}.`);
    console.log("First: "+req.body.first);
    console.log("Last: "+req.body.last);
    console.log("Password: "+req.body.pwd);
    console.log("Wallet: "+req.body.wal);

    //var dataR = JSON.parse(fs.readFileSync('data/user.json'));
    //console.log(dataR);
    //console.log(new User(req.body.first, req.body.last, req.body.pwd, req.body.wal));
    readUser.user.push(new User(req.body.first, req.body.last, req.body.pwd, req.body.wal));
    var user = {
      first: req.body.first,
      last: req.body.last,
      password: req.body.pwd,
      wallet: req.body.wal
    };


});




//START SERVER
app.listen(8000, function(){
    setContract();  //create the contract
    readStartingData();
    console.log("Server running at http://127.0.0.1:8000/\n");
    
    //EXAMPLE OF TRANSACTION USING SMART CONTRACT'S METHODS USING CALL AND SEND
    /*contract.methods.create(7,1).send({from: "0x474C558D42fF151511470cE5F357c77D05cf5934", gas: 4712388, gasPrice: 100000000000});
    
    contract.methods.getNumVer(4).call({from: "0x474C558D42fF151511470cE5F357c77D05cf5934", gas: 4712388, gasPrice: 100000000000}, function(err, res){
      if(err){
        console.error(err);
      }
      else{
        console.log("num: "+res);
      }
    });

    contract.methods.update(4,0,57).send({from: "0x474C558D42fF151511470cE5F357c77D05cf5934", gas: 4712388, gasPrice: 100000000000});

    contract.methods.update(7,4,7).send({from: "0x474C558D42fF151511470cE5F357c77D05cf5934", gas: 4712388, gasPrice: 100000000000}).on('confirmation', (confirmationNumber, receipt) => {/*console.log(receipt);
      console.log(receipt.events.ChangeDocument.returnValues.usr);
      console.log(receipt.events.ChangeDocument.returnValues.doc.toNumber());
      console.log(receipt.events.ChangeDocument.returnValues.version.toNumber());});

    contract.methods.get(7,1).call({from: "0x474C558D42fF151511470cE5F357c77D05cf5934", gas: 4712388, gasPrice: 100000000000}, function(err, res){
      if(err){
        console.error(err);
      }
      else{
        console.log("creator: "+res.creator);
        console.log("value: "+res.value);
        console.log("creation: "+res.creation);
        console.log("version: "+res.version);
      }
    });

    contract.methods.getNumVer(7).call({from: "0x474C558D42fF151511470cE5F357c77D05cf5934", gas: 4712388, gasPrice: 100000000000}, function(err, res){
      if(err){
        console.error(err);
      }
      else{
        console.log("num: "+res);
      }
    });*/
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

//read data files starting the server
function readStartingData(){
  readUser = JSON.parse(fs.readFileSync('data/user.json'));
}

//timer to save data
setInterval(function(){
  console.log("\nSaving data....\n")
  var dataW = JSON.stringify(readUser);
  fs.writeFileSync('data/user.json', dataW); 
}, 20000);

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
        "type": "function"
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
        "type": "event"
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
        "type": "function"
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
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "ver",
            "type": "uint256"
          }
        ],
        "name": "get",
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
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "getNumVer",
        "outputs": [
          {
            "name": "num",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];

    contractAddress = '0x41808BB59c2D89a0c8E876850C5A2471d30b16Fb';

    contract = new web3js.eth.Contract(contractABI, contractAddress);
}