// This Javascript code handel's functions for (soon to be) all voting pages.
// XMLHttpRequest
// var xhr = new XMLHttpRequest();
// xhr.open("POST", '/test', true);

// //Send the proper header information along with the request
// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

// xhr.onreadystatechange = function() {//Call a function when the state changes.
//     if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
//         // Request finished. Do processing here.
//     }
// }
// xhr.send("foo=bar&lorem=ipsum");
// // xhr.send('string');
// // xhr.send(new Blob());
// // xhr.send(new Int8Array());
// // xhr.send({ form: 'data' });
// // xhr.send(document);
// newpage += "<script>";
//   newpage += "let reload = document.getElementById('reload');";
//   newpage += "let createnew = document.getElementById('back');";
//   newpage += "let home = document.getElementById('home');";
//   newpage += "console.log('working');";
//   for(var k = 0; k < num; k++){
//     newpage += "console.log('vote"+k+"');";
//     newpage += "let vote"+k+" = document.getElementById('vote"+k+"');";
//     newpage += "vote"+k+".addEventListener('click',function(e){console.log(e.target.textContent++);});";
//   }
//   newpage += "reload.addEventListener('click', function(){console.log('click');window.location.reload(true);});";
//   newpage += "createnew.addEventListener('click', function(){console.log('create click');location = 'https://voteit.glitch.me/create'});";
//   newpage += "home.addEventListener('click', function(){console.log('home click');location = 'https://voteit.glitch.me/'});";
//   newpage += "";
//   newpage += "";
//   newpage += "</script>";
console.log("user script");

let reload = document.getElementById('reload');
let createnew = document.getElementById('back');
let home = document.getElementById('home');
let title = document.getElementById('title');
let desc = document.getElementById('desc');
let filename = document.getElementById('filename');

let real = [];

for(var i = 0; i < 10; i++){
  let tmp = "vote" + i;
  if(document.getElementById(tmp)){
    real.push(document.getElementById(tmp));
  }
}

let flag = true;

for(var j = 0; j < real.length; j++){
  real[j].addEventListener('click', function(e){
    //console.log("outgoing to /test");

    let make = new XMLHttpRequest();
    let trgt = Number(e.target.id.toString().substring(4))+1;
    let path = "https://voteit.glitch.me/fetch?file=" + filename.getAttribute('value') + "&vote=vote" + trgt;

    //'https://voteit.glitch.me/fetch?file=testing.ejs&vote=vote1'
    let outgoing = new XMLHttpRequest();
    outgoing.open("POST", 'https://voteit.glitch.me/test' , true);
    outgoing.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    outgoing.onreadystatechange = function(){

      if(XMLHttpRequest.DONE === 4 && outgoing.status == 200){
        //console.log("Goose says " + (outgoing.responseText||"quack"));
        if(this.response && flag){
          make.open("GET", path, true);
          make.setRequestHeader("Content-type","text/html");
          make.send('blah');
          console.log("resp " + this.response);
          console.log("html " + e.target.innerHTML);
          e.target.innerHTML = Number(e.target.innerHTML) + 1;
          flag = false;
        }
      }
    };
    let names = '';
    for(var k = 0; k < real.length; k++){
      names += real[k].id+",";
    }
    let fn = filename.getAttribute('value') + ".ejs";
    outgoing.send("bird="+this.id+"&title="+fn+"&desc="+desc.innerHTML+"&names="+names);

  });
}

// let v1 = document.getElementById('vote0');
// v1.addEventListener('click', function(e){
//   console.log("outgoing to /test");
//   let outgoing = new XMLHttpRequest();
//   outgoing.open("POST", 'https://voteit.glitch.me/test', true);
//   outgoing.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//   outgoing.onreadystatechange = function(){
//     console.log(XMLHttpRequest.DONE === 4);
//     console.log(outgoing.status == 200);

//     if(XMLHttpRequest.DONE === 4 && outgoing.status == 200){
//       console.log("Goose says " + (outgoing.responseText||"quack"));
//       console.log("resp " + this.response);
//     }
//   };
//   outgoing.send("bird="+v1.id+"&title="+title.innerHTML);
// });

reload.addEventListener('click', function(){console.log('click');window.location.reload(true);});
createnew.addEventListener('click', function(){console.log('create click');location = 'https://voteit.glitch.me/create'});
home.addEventListener('click', function(){console.log('home click');location = 'https://voteit.glitch.me/'});