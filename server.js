const express = require('express');
const app = express();
require('ejs');

const port = process.argv[2] || 3000;
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next){
  console.log("Request from IP:",req.headers['x-forwarded-for'].split(',')[0]);
  console.log("Requesting URL:",req.originalUrl);
  next();
});

app.get('/', function(req, res, next){
  console.log("in index");
  res.render("index.ejs", {"query":"index page"});
  next();
});
app.get('/login',function(req, res, next){
  console.log("in login");
  if(req.query.github == 'on'){
    res.render("login.ejs", {"query": "github selected"} );
  }
  if(req.query.email == 'on'){
    res.render("login.ejs", {"query": "email selected"} );
  }
  next();
});

app.listen(port, function(){
  console.log("Server started on port", port);
});