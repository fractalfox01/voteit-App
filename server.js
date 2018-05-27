const express = require('express');
const app = express();

const mongo = require('mongodb');

require('ejs');

const port = process.argv[2] || 3000;
app.set("view engine","ejs");
app.set("views", (__dirname + "/views"));
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

app.get('/login',function(req, res, next){
  console.log("in login");
  if(req.query.github == 'on'){
    res.render("login.ejs", {"query": "github selected"} );
  }else if(req.query.email == 'on'){
    res.render("login.ejs", {"query": "email selected"} );
  }else{
    res.status(403).set({'content-type':'text/html'});
    next();
  }

});

app.all('*', function(req, res, next){
  console.log("status",res.statusCode);
  if(req.params['0']){
    console.log(req.params['0']);
  }
  if(res.statusCode == 403){
    res.write("<h1 style='color:red;'>Forbidden - Access Denied</h1>");
    res.end();
  }else{
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