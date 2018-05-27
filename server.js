const express = require('express');
const app = express();

const fs = require('fs');
const mongo = require('mongodb');

//require('ejs');

const port = process.argv[2] || 3000;

// Set's the application templating view and engine to use "EJS".
app.set("view engine","ejs");

// Append's /views to the default Env path for ejs's templating.
app.set("views", (__dirname + "/views"));

// Set's environment path for client side ( Static ) requests.
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next){
// app.all triggers on all requests to the server, valid or not.
//
// Example: a request to https://voteit.glitch.me/login?hows_it_going
//   Returns logs  |
//                 |
//                \/
//
// Request from IP: <requesting IP>
// Requesting URL: /login?hows_it_going
//
//____________________________________________________________________
  console.log("Request from IP:",req.headers['x-forwarded-for'].split(',')[0]);
  console.log("Requesting URL:",req.originalUrl);
  next();
});

app.get('/', function(req, res, next){
  if(req.originalUrl != "/"){
    console.log("Query:",JSON.stringify(req.query));
    res.status(403).set({'content-type':'text/html'});
    next();
  }else{
    res.render("index.ejs", {"query":"index page"});
  }
});

app.get('/login', function(req, res, next){
  // Login Page.
  // Handles oauth assignment.
  // Status code 403 assigned if required elements not found.
  console.log("in login");

  if(req.query.github == 'on'){
    // checking for github.
    res.render("login.ejs", {"query": "github selected"} );

  }else if(req.query.email == 'on'){
    // checking for email.
    res.render("login.ejs", {"query": "email selected"} );

  }else{
    // No valid elements found.
    res.status(403).set({'content-type':'text/html'});
    next();
  }

});
var bodyParser = require('body-parser'); app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

app.all('/create', function(req, res, next){
  if(req.method == 'GET'){
    console.log("GET - creating new ejs file");
    res.render("create.ejs");
  }else if(req.method == 'POST'){
    console.log("POST - creating new ejs file");
    console.log(req.body.filename.name);
    console.log();
    res.render("create.ejs");
  }else{
    next();
  }
});

app.all('*', function(req, res, next){
  // Handle's route fall-through
  // if the request make's it this far, then it found no matches (status != 200).
  //
  // handle's header status codes (403 - Forbidden) and (404 - Not found).
  //
  //_____________________________________________________________________________

  console.log("status",res.statusCode);
  if(req.params['0']){
    // param was passed

    console.log("Parameters " + req.params['0']);
  }

  if(res.statusCode == 403){
    // All non-matched routes are forbidden.

    res.write("<h1 style='color:red;'>Forbidden - Access Denied</h1>");
    res.end();
  }else{
    // triggers on all other unknown requests to the server.
    // Treating as a not found error ( 404 ).

    console.log("some other error");
    console.log(res.statusCode);
    res.status(404);
    res.write("<h1>Status Code " + res.statusCode + "</h1>");
    res.write("<h1>Failed to find " + req.originalUrl + "</h1>");
    res.end();
  }

});

app.listen(port, function(){
  console.log("Server started on port", port);
});