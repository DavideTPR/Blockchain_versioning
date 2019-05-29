// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './data/file/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })


const app = express();
app.use(bodyParser.urlencoded({extended: true}))

 
//ROUTES WILL GO HERE
/*app.get('/', function(req, res) {
    res.json({ message: 'WELCOME' });   
});*/

app.get('/',function(req,res){
    res.sendFile(__dirname + '/idx.html');
   
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
    
  });
 
app.listen(3000, () => console.log('Server started on port 3000'));