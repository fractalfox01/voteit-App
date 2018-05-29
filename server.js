const express = require('express');
const app = express();

const fs = require('fs');
const mongo = require('mongodb');

const port = process.argv[2] || 3000;

// All files in views/ directory that should not be editable/displayed to a basic user should be included in the excluded array.
const excluded = ["index.ejs","login.ejs","search.ejs","forbidden.ejs","create.ejs","404.ejs", "partials", "public", "styles"];

const dir = "views/";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(1000+max));
}

function buildPage(filename, desc, num, names){
  console.log("Filename: " + filename);
  console.log("Description: " + desc);
  console.log("Number of Choices: " + num);
  let newpage = "<!DOCTYPE html>";
  newpage += "<head>";
  newpage += "<%- include partials/head.ejs %>";
  newpage += "<style>";
  newpage += "body{background-color: #ccc;}";
  //body{b
  newpage += "header{text-align: center;padding-top: 5px;height: 2.3em;font-size: 2em;background-color: #3030a9;color: #ccc;}";
  newpage += "#3030a9;color: #ccc;}input{background-color: #fff;width: 20px;height: 20px;}";
  newpage += "button{margin-left: 47vw;border-radius: 10px;}";
  newpage += "footer{position: absolute;width: 100%;margin-top: 10vw;text-align: center;}";
  newpage += "nav{display: flex;flex-direction: row;}";
  newpage += ".nav-btn{height: 30px;background-color: #ccc;flex-grow: 1;font-size: 1.5em;text-align: center;padding-top: 5px;border: 1px solid #000;}";
  newpage += ".nav-btn:hover{background-color: #cce;}";
  newpage += "#back{color:blue;order:0}";
  newpage += "#home{color:blue;order:0}";
  newpage += "";
  newpage += "#wrapper{margin-left: 100px;margin-right: 100px;display: flex;flex-direction: row;}";
  newpage += ".option{height: 300px;flex-grow: 1;background-color: #ccc;border: 2px solid #000;}";
  for(var i = 0;i < num; i++){
    newpage += ".obj"+i+"{order: "+i+";}";
    newpage += ".obj"+i+":hover{background-color:blue;opacity: .5;}";
  }
  newpage += "h4{margin-left:2vw;font-size:1.5em;}";
  newpage += "#title{margin:0px 100px 50px 100px;height:20vh;width:auto;background-color:#979797;}";
  newpage += "#reload{color:#00f;}";
  newpage += "</style>";
  newpage += "</head>";
  newpage += "<body>";
  newpage += "<%- include partials/header.ejs %>";
  newpage += "<nav id='nav'><div id='back' class='nav-btn'>Create New</div><div id='home' class='nav-btn'>Home</div></nav><hr/>";
  newpage += "<button id='reload' type='button'>Change Colors</button>";
  newpage += "<section id='title'>";
  newpage += "<h4>post name: " + filename + "</h4>";
  newpage += "<h4>"+desc+"</h4>";
  newpage += "</section>";
  newpage += "<div id='wrapper'>";
  for(var j = 0;j < num; j++){
    let marble = getRandomInt(j+1);
    newpage += "<div class='obj"+j+" option' style='color:#fff;background-color:#" + (((marble <= 999) && (marble >= 101)) ? marble : ("00" + j) ) +  ";'>";
    newpage += "<h3 style='text-align:center;'>" + names[j] + "</h3>";
    newpage += "</div>";
  }
  newpage += "</div>";
  newpage += "<script>";
  newpage += "let reload = document.getElementById('reload');";
  newpage += "let createnew = document.getElementById('back');";
  newpage += "let home = document.getElementById('home');";
  newpage += "";
  newpage += "reload.addEventListener('click', function(){console.log('click');window.location.reload(true);});";
  newpage += "createnew.addEventListener('click', function(){console.log('create click');location = 'https://voteit.glitch.me/create'});";
  newpage += "home.addEventListener('click', function(){console.log('home click');location = 'https://voteit.glitch.me/'});";
  newpage += "";
  newpage += "";
  newpage += "</script>";
  newpage += "</body>";
  newpage += "<%- include partials/footer.ejs %>";
  // newpage += "";
  // newpage += "";

  return newpage;


}

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
  console.log('');
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
  let filename;
  if(req.method == 'GET'){
    console.log("GET - creating new ejs file");
    filename = "";
    res.render("create.ejs", { filename });
  }else if(req.method == 'POST'){
    console.log("POST - submitting attributes");
    if(!req.body.filename){
      req.body.filename.name = "";
    }
    let filename = req.body.filename.name;
    let desc = req.body.description.desc;
    let num = req.body['choice-items'].num;
    let names = [];
    for(var g in req.body.choice){
      let v = req.body.choice[g.toString()];
      names.push(v);
    }
    //  Creation of users ejs file.
    let postbody = buildPage(filename, desc, num, names);

    fs.writeFile("views/" + filename + ".ejs", postbody, function(err){
      if(err) {
        console.log(err.stack);
        next();
      }
      console.log("new file created");
    });
    // req.body.filename.name
    // req.body.description.desc
    // req.body.choice-items.num

    console.log();
    // NOTE:----------------if the user created page stops displaying but, it's still being created. then its probably because its displaying before its created.
    // give it more time.
    setTimeout(function(){
      res.render( filename + ".ejs" );
    },1000)

  }else{
    next();
  }
});

app.get('/search', function(req, res, next){
  // /search uses the fs module to return the directory contents of views/
  // This function uses the array "excluded" to check for files that should NOT be displayed to the user.
  let fileArr = [];
  let count = 0;
  fs.readdir(dir, (err, data) => {
    if(err) {
      let tried = "Directory Read Error";
      tried += "<p>" + err.stack + "</p>";
      res.render('404.ejs',{ tried });
    }

    let len = data.length;
    for(var i = 0;i < len; i++){
      for(var j = 0; j < excluded.length; j++){
        if(data[i].toString() == excluded[j]){
          break;
        }else{
          count++;
        }
      }
      if(count == excluded.length){
         fileArr.push(data[i].toString());
         count = 0;
      }else{
        count = 0;
      }
    }
  });
  setTimeout(function(){
    console.log(fileArr);
    res.render('search.ejs', { fileArr });
  },1000);

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
    res.render('forbidden.ejs');
    // res.write("<h1 style='color:red;'>Forbidden - Access Denied</h1>");
    // res.end();
  }else{
    // triggers on all other unknown requests to the server.
    // Treating as a not found error ( 404 ).

    console.log("some other error");
    console.log(req.body);
    console.log(res.statusCode);
    // res.status(404);
    // res.write("<h1>Status Code " + res.statusCode + "</h1>");
    // res.write("<h1>Failed to find " + req.originalUrl + "</h1>");
    // res.end();
    let tried = req.originalUrl;
    res.render('404.ejs',{tried});
  }

});

app.listen(port, function(){
  console.log("Server started on port", port);
});