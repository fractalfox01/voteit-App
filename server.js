const express = require('express');
const app = express();

const fs = require('fs');
const mongo = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    store: new MongoStore({
      url: process.env.URL,
      ttl:  30 * 60 * 60 // = half an hour
    }),
    secret: process.env.BUM,
    cookie: {
            expires: 15 * 60 * 1000 // 15 min
        },
    resave: false,
    saveUninitialized: false
}));

const port = process.argv[2] || 3000;

// All files in views/ directory that should not be editable/displayed to a basic user should be included in the excluded array.
const excluded = ["index.ejs","login.ejs","search.ejs","forbidden.ejs","create.ejs","404.ejs", "partials", "public", "styles"];

const dir = "views/";

function searchAll(){
  let fileArr = [];
  let count = 0;
  fs.readdir(dir, (err, data) => {
    if(err) {
      let tried = "Directory Read Error";
      tried += "<p>" + err.stack + "</p>";
      return tried;
    }

    let len = data.length;
    for(var i = 0;i < len; i++){
      for(var j = 0; j < excluded.length; j++){
        // if found file is also in excluded.
        if(data[i].toString() == excluded[j]){
          break;
        }else{
          count++;
        }
      }
      if(count == excluded.length){
        let tmp = data[i].toString();
        tmp = tmp.substring(0, tmp.length - 4 );
        fileArr.push(tmp);
        count = 0;
      }else{
        count = 0;
      }
    }
  });
  return fileArr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(1000+max));
}

// The function buildpage is used for dynamically creating ejs pages and, for updating a single pre-defined value within.
// Arguments are: buildpage(String, String, Integer, Array[String], String)
// Respectively: name of file to create, description of file, Number of names, array of names, the ID of the element to increment.
function buildPage(filename, desc, num, names, update, colors){
  if(filename[0] == "."){
    filename = filename.substring(1);
  }
  let funFlag = false;
  console.log("Filename: " + filename);
  console.log("Description: " + desc);
  console.log("Number of Choices: " + num);
  if(update !== undefined ){
    funFlag = true;
    console.log("Updating vote: " + update);
  }
  let newpage = "<!DOCTYPE html>";
  newpage += "<head>";
  newpage += "<%- include partials/head.ejs %>";
  newpage += "";
  newpage += "<style>";
  newpage += "body{background-color: #ccc;}";
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
  newpage += "#wrapper{margin-left:2vw;margin-right:2vw;display: flex;flex-direction: row;}";
  newpage += ".option{min-width:9vw;height: 300px;flex-grow: 0;background-color: #ccc;border: 2px solid #000;}";
  for(var i = 0;i < num; i++){
    newpage += ".obj"+i+"{order: "+i+";}";
    newpage += "#vote"+i+"{opacity: 1;}";
    newpage += "#vote"+i+":hover{background-color:blue;opacity: .5;}";
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
  newpage += "<h4 id='filename' value='"+filename+"'>post name: " + filename + "</h4>";
  newpage += "<h4 id='desc'>"+desc+"</h4>";
  newpage += "</section>";
  newpage += "<div id='wrapper'>";
  for(var j = 0;j < num; j++){
    if(funFlag){
      newpage += "<div class='obj" + j + " option'><h3 style='text-align:center;'>" + names[j] + "</h3>";
      newpage += "<div id='vote"+j+"' style='width:auto;height:80%;color:#fff;background-color:" + colors[j] +  ";'>" + update[j];
      newpage += "</div></div>";
    }else{
      let marble = getRandomInt(j+1);
      newpage += "<div class='obj" + j + " option'><h3 style='text-align:center;'>" + names[j] + "</h3>";
      newpage += "<div id='vote"+j+"' style='width:auto;height:80%;color:#fff;background-color:#" + (((marble <= 999) && (marble >= 101)) ? marble : ("00" + j) ) +  ";'>0";
      newpage += "</div></div>";
    }
  }
  newpage += "</div>";
  newpage += "</body>";

  newpage += "<%- include partials/footer.ejs %>";
  newpage += "<script src='/scripts/user.js'></script>";
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
// Triggers for all requests to the server, valid or not. Then passes the request on with next().
//
// Example: a request to https://voteit.glitch.me/login?hows_it_going
//|
// Request from IP: <requesting IP>
// Requesting URL: /login?hows_it_going
// ____________________________________________________________________
  // if(req.session.page_views){
  //     req.session.page_views++;
  //     //res.send("You visited this page " + req.session.page_views + " times");
  //  } else {
  //     req.session.page_views = 1;
  //     //res.send("Welcome to this page for the first time!");
  //  }
  console.log('');
  console.log("Request from IP:",req.headers['x-forwarded-for'].split(',')[0]);
  console.log("Requesting URL:",req.originalUrl);
  next();
});

//=================================================== INDEX ========================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ================================================== INDEX ========================================================================
app.get('/', function(req, res, next){
  if(req.session.index_views){
      req.session.index_views++;
      //res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.index_views = 1;
      //res.send("Welcome to this page for the first time!");
   }
  if(req.originalUrl != "/"){
    console.log("Query:",JSON.stringify(req.query));
    res.status(403).set({'content-type':'text/html'});
    next();
  }else{

    res.render("index.ejs", {"query":"index page"});
  }
});

//=================================================== LOGIN ========================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ================================================== LOGIN ========================================================================
app.get('/login', function(req, res, next){
  if(req.session.login_views){
      req.session.login_views++;
      //res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.login_views = 1;
      //res.send("Welcome to this page for the first time!");
   }
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

//=================================================== CREATE ========================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ================================================== CREATE ========================================================================
// The form needs to be re-done;
// page generate (in-page)? color picker implemantation? done like post routing, use value routing?
app.all('/create', function(req, res, next){
  if(req.session.create_views){
      req.session.create_views++;
      //res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.create_views = 1;
      //res.send("Welcome to this page for the first time!");
   }
  //res.cookie('name', 'express');
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
    if(filename[0] == "."){
      filename = filename.substring(1);
    }
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
    },1500)

  }else{
    next();
  }
});
//=================================================== SEARCH ========================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ================================================== SEARCH ========================================================================
app.get('/search', function(req, res, next){
  if(req.session.search_views){
      req.session.search_views++;
      //res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.search_views = 1;
      //res.send("Welcome to this page for the first time!");
   }

  // /search uses the fs module to return the directory contents of views/
  // This function uses the array "excluded" to check for files that should NOT be displayed to the user.
  let fileArr = searchAll();

  setTimeout(function(){
    console.log(fileArr);
    res.render('search.ejs', { fileArr });
  },1000);


});

//=================================================== LOOKUP ========================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ================================================== LOOKUP ========================================================================
app.get('/lookup:qwry', function(req, res, next){

  let flag = false;
  let tmp = "";
  //console.log(req.params.qwry);
  if(req.params.qwry){
    tmp = req.params.qwry;
    tmp = tmp.substring(1);
  }else{
    tmp = "void";
  }

  for(var i = 0; i < excluded.length; i++){
    //console.log(tmp == excluded[i].toString())
    if(excluded[i].toString().includes(tmp)){
      flag = true;
    }
    //console.log('next');
  }
  if(flag){
    let tried = tmp;
    let status = res.statusCode;
    res.render('404.ejs',{ tried, status });
  }else{
    if(req.session[tmp+"_views"]){
      req.session[tmp+"_views"]++;
      //res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session[tmp+"_views"] = 1;
      //res.send("Welcome to this page for the first time!");
   }
    res.render(tmp);
  }
  // res.status(200).set({'content-type':'text/html'});
  // res.write("<h1>" + tmp.substring(1) + "</h1>");
  // res.end();
});

//=============================================== /Test =========================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ============================================== /Test =========================================================================
app.post('/test', function(req, res, next){
  // bird is ID of vote element, skunk is page title.
  // currently working. still needs to update ejs document with vote. done here.
  // check if IP has made vote on page. 1 vote per IP?. mongodb for ip's or file list?
  console.log(req.body);
  let desc = req.body.desc;

  let names = req.body.names;
  names = names.split(',');
  names.pop();

  let num = names.length;

  let skunk = req.body['title'].toString();
  //console.log("Vote for: " + req.body.bird + "\nIn: " + skunk);

  console.log("creation values:");
  console.log(skunk + "\n" + desc + "\n" + num + "\n" + names + "\n" + req.body.bird);

  if(req.session[skunk+"_votes"]){
      res.send();
  } else {
    req.session[skunk+"_votes"] = 1;
//     let postbody = buildPage(skunk, desc, num, names, req.body.bird);

//     fs.writeFile("views/" + filename + ".ejs", postbody, function(err){
//       if(err) {
//         console.log(err.stack);
//         next();
//       }
//       console.log("new file created");
//     });

    res.send(req.body.bird);
  }
});

//===============================================================================================================>
//==============================================Functions========================================================>
//===============================================================================================================>
function cb(req, res, temp){
  // will do nothing, cb to be removed.
  // should add GET to /fetch in user.js at appropriate point.
  // user.js already handles update, I just need to change it in the fs for future viewers.
  res.status(200).set({'content-type':'text/html'});
  res.write(temp);
  res.end()
}

function changepage(req, res, next, file, vote, cb){
  fs.readFile("views/"+file+".ejs", function(err,data){
    if(err){
      console.log(err.stack);
    }
    if(data){
      // vtArr is an array of integers. represents current total votes for each index respecively.
      let vtArr = [];
      let names = [];
      let colors = [];
      let num = 0;
      let desc = data.toString().split("id='desc'")[1].toString().split("</h4>")[0].toString().substring(1);
      // num will equal names.length
      let arf = data.toString().split('section')[2].split('option');
      // arf[1].toString() example
      // Requesting URL: /fetch?file=testing.ejs&vote=vote1
      // '><h3 style='text-align:center;'>One</h3><div id='vote0' style='width:auto;height:80%;color:#fff;background-color:#183;'>0</div></div><div class='obj1
      for(var i = 1; i < arf.length; i++){
        let tmp = arf[i].split('</div>')[0].toString();
        let name = tmp.substring(33, tmp.split('</h3>')[0].length);
        let color = tmp.split('background-color:')[1].substring(0, 4);

        //console.log("color:",color);
        colors.push(color);
        names.push(name);
        // tmp = '><h3 style='text-align:center;'>One</h3><div id='vote0' style='width:auto;height:80%;color:#fff;background-color:#183;'>0
        //console.log(tmp);
        if(("vote"+i) == vote){
          vtArr.push((Number(tmp[tmp.length-1])+1));
          //console.log("id vote" + (i-1) + " is now " + (Number(tmp[tmp.length-1])+1));

        }else{
          vtArr.push(tmp[tmp.length-1]);
          //console.log("id vote" + (i-1) + " is still " + tmp[tmp.length-1]);
        }
      }
      // buildPage(filename, desc, num, names, update, colors)
      // use buildpage()? to build temp, then erase old and rename temp as old.
      console.log(file);// filename
      console.log(desc);// description
      console.log(num = names.length);// num of vote items
      console.log(names.toString());// name of each vote item
      console.log(vtArr.toString());// array of vote totals
      let tempPage = buildPage(file, desc, num, names, vtArr, colors);

      fs.writeFile("views/" + file +".ejs", tempPage, function(err){
      if(err) {
        console.log(err.stack);
        next();
      }
      console.log("new file created");
    });
      // cb will be deleted after done codeing here.
      // just so i can see in a browser that nothing failed.
      //cb(req, res, tempPage);
    }else{
      next();
    }
  })

}
//=====================fetch test============================
//
//=====================fetch test============================
app.get('/fetch', function(req, res, next){
  // if(req.session[+"_votes"]){
  //     res.send();
  // } else {
  //   req.session[+"_votes"] = 1;
  // }


  // Does not return any page. just makes server-side changes.
  // tests if request contains a file and vote query.

  // loop in changepage is dependent on starting at one.
  // incoming vote needs to take into consideration.
  // ie. vote0 will do absolutely nothing.
  let flag = true;
  if(req.query.file && req.query.vote){
    if(req.session[req.query.name+"_votes"]){
      req.session[req.query.name+"_votes"]++;
    }else{
      req.session[req.query.name+"_votes"] = 1;
    }
    for(var i = 0; i < excluded.length; i++){
      if(req.query.file == excluded[i].toString()){
        flag = false;
      }
    }
    if(flag){
      let file = req.query.file;
      let vote = req.query.vote;
      changepage(req, res, next, file, vote, cb);
    }else{
      res.status(404);
      next();
    }
  }else{
    next();
  }
});

//=============================================== 403 & 404 ERRORs ==================================================================
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
//   {{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}{{}}
// ============================================== 403 & 404 ERRORs ==================================================================
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

    console.log("Error");
    console.log("POST params " + req.body);
    //console.log(res.statusCode);
    // res.status(404);
    // res.write("<h1>Status Code " + res.statusCode + "</h1>");
    // res.write("<h1>Failed to find " + req.originalUrl + "</h1>");
    // res.end();
    let tried = req.originalUrl;
    let status = res.statusCode;
    res.render('404.ejs',{tried, status});
  }

});

app.listen(port, function(){
  console.log("Server started on port", port);
});