//imports
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
var server = express();
var req = require('request');

//instantiation
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const fileUpload = require("express-fileupload");

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }))



server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload());

// Configure routes
server.get('/', function(req, res) {
    // let parsedURL = url.parse(req.url, true);
    // let path = parsedURL.path.replace(/^\/+|\/+$/g, "");
    // /**

    // if (path == "") {
    //     path = "index.html";
    // }
    // console.log(`Requested path ${path}`);
    // let file = __dirname + "/public/" + path;
    // fs.readFile(file, function(err, content) {
    //     if (err) {
    //         console.log(`File Not Found ${file}`);
    //         res.writeHead(404);
    //         res.end();

    //     } else {
    //         console.log(`Returning ${path}`);
    //         res.setHeader("X-Content-Type-Options", "nosniff");
    //         switch (path) {
    //             case "main.css":
    //                 res.writeHead(200, {
    //                     "Content-type": "test/css"
    //                 });
    //                 break;
    //             case "main.js":

    //                 res.writeHead(200, {
    //                     "Content-type": "application/javascript"
    //                 });
    //                 break;
    //             case "index.html":
    //                 res.writeHead(200, {
    //                     "Content-type": "text/html"
    //                 });
    //         }
    //         res.end(content);
    //     }
    // });


    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur notre super server</h1>');

});
// server.use(express.static('public'));

server.use('/api/', apiRouter);


server.listen(3000, function() {
    console.log('Server en écoute :');
});