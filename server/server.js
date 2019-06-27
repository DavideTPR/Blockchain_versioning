//fs for file system
const fs = require('fs');
//express for web server
const express = require('express');
const parser = require('body-parser');  //read form data
const cookieParser = require('cookie-parser'); //to manage coockie
var session = require('express-session');
const app = express();
//multer for saving uploaded file
//set up saving directory
const multer  = require('multer');
const dirSave = './data/file/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirSave);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
//web3js to interface smart contract
const web3 = require('web3');
const web3js = new web3(new web3.providers.HttpProvider("http://127.0.0.1:7575"));


var myAddress;
var toAddress;//address to send transaction
var contractABI;//contract ABI
var contractAddress; //contract address
var contract; //the contract

var readUser; //user of the system

//User object
function User(id, first, last, password, wallet, username){
  this.id = id;
  this.first = first;
  this.last = last;
  this.username = username;
  this.password = password;
  this.wallet = wallet;
}

//local Document object
function Document(id, creator, path, creation, version, description){
  this.id = id;
  this.creator = creator;
  this.version = version;
  this.path = path;
  this.creation = creation;
  this.description = description;
}

//Data Object received from blockchain
function BlockDoc(id, creator, path, creation, version, description, value){
  this.id = id;
  this.creator = creator;
  this.version = version;
  this.path = path;
  this.creation = creation;
  this.description = description;
  this.value = value;
}

//Parser for reading form data
app.use(parser.urlencoded({ extended: true })); 

//Parser and cookies management
app.use(cookieParser());
app.use(session({
  key: 'user',
  secret: 'key1',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user && !req.session.user) {
      res.clearCookie('user_sid');        
  }

  req.cookies.id = 3;

  next();
});

//send automatically style and script files
app.use('/CSS',express.static('../client/CSS'));
app.use('/JS',express.static('../client/JS'));
/* G E T  R E Q U E S T */

//index request
app.get("/"  || "/index" || "/index.html", function(req, res){
    sendFile(res, '../client/HTML/index.html', 'text/html');
})

//subscribe request
app.get("/subscribe.html" || "/subscribe", function(req, res){
    sendFile(res, '../client/HTML/subscribe.html', 'text/html');
})

//login request
app.get("/login.html" || "/login", function(req, res){
  sendFile(res, '../client/HTML/login.html', 'text/html');
});

//update request
app.get("/update.html" || "/update", function(req, res){
  sendFile(res, '../client/HTML/update.html', 'text/html');
});

//example request
app.get("/dataDoc", function(req, res){
  console.log("DATADOC");
  res.writeHead = 'text/html';
  sendFile(res, '../client/HTML/example.html', 'text/html');
});

//add new document request
app.get("/add.html" || "/add", function(req, res){
  sendFile(res, '../client/HTML/add.html', 'text/html');
});

//error page for same file upload
app.get("/updError" || "/updError.html", function(req, res){
  sendFile(res, '../client/HTML/updError.html', 'text/html');
})

//general error page
app.get("/error" || "/error.html", function(req, res){
  sendFile(res, '../client/HTML/error.html', 'text/html');
})


/** A J A X / J Q U E R Y   R E Q U E S T  */

//send list of document
app.get("/list", function(req, res){
  console.log("getListDoc");
  readStartingData();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(JSON.stringify(listDoc));
  res.end();
});


//send list of version
app.post('/version', (req, res) => {
  console.log("Get POST request");

  //parse id and version to int
  var id = parseInt(req.body.ID, 10);
  var version = parseInt(req.body.ver);

  //use call because this transaction it's informative and it hasn't to use currency
  contract.methods.get(id,version).call({from: req.body.wall, gas: 4712388, gasPrice: 100000000000})
  .then((result) => {
    res.send(JSON.stringify(new BlockDoc(id,result.creator, listDoc.doc[id].path, new Date(result.creation.toNumber()*1000).toUTCString(), result.version, "", result.value )));
  })
  .catch(err => {
    res.redirect("/error.html");
  });

});

/* P O S T  R E Q U E S T */
//example of post request
app.post('/example', (req, res) => {
    console.log("Get POST request");
});

//data from subscribe
app.post('/subscribe', (req, res) => {
    console.log("Get POST SUB request");

    
    //add user to user.json document
    readUser.user.push(new User((readUser.user.length),req.body.first, req.body.last, req.body.pwd, req.body.wal, req.body.usr));
    res.redirect("/login.html");
});

//get data from login form and save them
app.post('/login', (req, res) => {
  console.log("Get POST request");

  var tmp; //tmp object to send to the client
  //check if the user exist
  for(usr of readUser.user){
    if((usr.username == req.body.usr) && (usr.password == req.body.pwd)){
      //console.log("User exist");
      //if user exist save the cookies
      res.cookie('ID', usr.id, { maxAge: 900000, httpOnly: false});
      res.cookie('wall', usr.wallet, { maxAge: 900000, httpOnly: false});
      res.cookie('name', usr.username, { maxAge: 900000, httpOnly: false});
      res.redirect('/');
    }
  }
});

//add new documents into documents.josn and create them into blockchain
app.post('/add', upload.single('document'), (req, res, next) => {
  console.log("Get POST request");
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }

  //hash of file
  //We create the seed every time to avoid recreation error
  var hash = require('crypto').createHash('sha256').update(file.path).digest('hex');
  
  //id is zero if no documents, else is equal id of last doc added 1
  var id;
  if(listDoc.doc.length == 0){
    id = 0;
  }
  else{
    id = parseInt(listDoc.doc[listDoc.doc.length-1].id)+1;
  }

  //add new doc into the list
  listDoc.doc.push(new Document(id, req.cookies.ID, file.path,new Date(), 0, req.body.desc));
  //console.log(listDoc.doc);

  //create new element into blockchain
  contract.methods.create(id,hash).send({from: req.cookies.wall, gas: 4712388, gasPrice: 100000000000})
  .on('confirmation', (confirmationNumber, receipt) => {
    //save data and return to home page
    var dataD = JSON.stringify(listDoc);
    fs.writeFileSync('data/documents.json', dataD);
    res.redirect("/");
  })
  .on('error', ()=>{
    res.redirect("/error.html");
  });
});

//update a documents contained into blockchain
app.post('/update', upload.single('document'), (req, res, next) => {
  console.log("Get POST request");
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }

  //Document's ID
  //console.log(req.body.docId);

  //parse to int id and varsion values
  var id = parseInt(req.body.docId, 10);
  var version = parseInt(req.body.docVer);

  //Doc's hash to save into blockchain as doc's value
  var hash = require('crypto').createHash('sha256').update(file.path).digest('hex');

  //update document's info and save into blockchain
  contract.methods.update(id,version,hash).send({from: req.cookies.wall, gas: 4712388, gasPrice: 100000000000})
  .on('confirmation', (confirmationNumber, receipt) => {

    console.log(receipt.events.ChangeDocument.returnValues);

    listDoc.doc[id].version = receipt.events.ChangeDocument.returnValues.version.toNumber();
    listDoc.doc[id].description = req.body.desc;
    //listDoc.doc[id].description = req.body.desc;
    var dataD = JSON.stringify(listDoc);
    fs.writeFileSync('data/documents.json', dataD);
    res.redirect("/"); 
  }).on('error', ()=>{
    res.redirect("/updError");
  });

});


//START SERVER
app.listen(8000, function(){
    setContract();  //create the contract
    readStartingData();
    console.log("Server running at http://127.0.0.1:8000/\n");
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
  listDoc = JSON.parse(fs.readFileSync('data/documents.json'));
}

//timer to save data
//seve data with timer to avoid concurrent access
setInterval(function(){
  console.log("\nSaving data....\n")
  var dataW = JSON.stringify(readUser);
  fs.writeFileSync('data/user.json', dataW);
  var dataD = JSON.stringify(listDoc);
  fs.writeFileSync('data/documents.json', dataD); 
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
            "type": "string"
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
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "version",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "creator",
            "type": "address"
          }
        ],
        "name": "CreateDocument",
        "type": "event",
        "signature": "0x47b938f9605cee74df07534bf75bf0b154110b5080cdafe9f81a913838c30b19"
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
            "type": "string"
          },
          {
            "indexed": false,
            "name": "version",
            "type": "uint256"
          }
        ],
        "name": "ChangeDocument",
        "type": "event",
        "signature": "0x34244c4ec878d3f192e60998a65b7ecb9a2b2ea5ac8bdfa40285505a034cfb67"
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
            "type": "string"
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
          },
          {
            "name": "aCreator",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x0118fa49"
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
            "type": "string"
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
        "signature": "0xd753fd25"
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
            "type": "string"
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
        "signature": "0x669e48aa"
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
        "type": "function",
        "signature": "0x397ce25c"
      }
    ];

    contractAddress = '0x585a79b73b9644546675401Ef44a45Bfa05dB268';

    contract = new web3js.eth.Contract(contractABI, contractAddress);
}