const http = require('http');
const fs = require('fs');
const url = require('url');
//const express = require('express');
//const parser = require('body-parser');

/*const app = express();
app.use(parser.urlencoded({extended:true}))
app.post("/subscribe.html", function(requ, resp){
    console.log(requ.body);
});*/

var server = http.createServer(function(req, res){
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.end("Hello World!\n");
    console.log(url.parse(req.url, true));
    if(req.url == "/" || req.url == "/index" || req.url == "/index.html"){
        sendFile(res, '../client/HTML/index.html', 'text/html');
    }
    else if(req.url == "/subscribe.html" || req.url == "/subscribe"){
        sendFile(res, '../client/HTML/subscribe.html', 'text/html');
    }

    if(req.method == "POST"){
        console.log("Get POST request");

    }


}).listen(8000);

console.log("Server running at http://127.0.0.1:8000/\n");

function sendFile(response, pathPage, cont){
    fs.readFile(pathPage, function(err, page){
        response.writeHead(200, {'Content-Type': cont});
        response.write(page);
        console.log("Sending "+pathPage);
        response.end();
    });
}