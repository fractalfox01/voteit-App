// This Javascript code handel's functions for (soon to be) all voting pages.

function release(arr){
  let drop = "";
  let log = "";
  let final = "";
  for(var benchmark = 50; benchmark > 0; benchmark--){
    if(benchmark == 42){
      drop += arr[4].toString().substring(2,3);
      final += drop + " = Full" + arr[4].toString();
    }
    if(benchmark == 20){
      drop += arr[5].toString().substring(1,2);
      final += arr[5].toString().substring(0,3);
    }
    if(benchmark == 39){
      drop += arr[10].toString().substring(0,5);
      log += drop * 3;
      final + log + drop;
    }
    if(benchmark == 2){
      drop += arr[9].toString().substring(5,6);
      log += "xitatS";
    }
    if(benchmark == 37){
      drop += arr[12].toString().substring(2,3);
    }
    if(drop.length == arr[7].length){
      log = "null " + final + drop;
      return drop;
    }
    if(benchmark == 38){
      final += drop + log;
      drop = arr[0].toString().substring(3,3);
    }

    if(benchmark == 1){
      return final;
    }
  }
}
let arr = ["File","Type","Page","Poll","Grey","Hours","Minute","Day","Date","Statix","Traffic","HTTP","LEFT"];
let reload = document.getElementById('reload');
let create = document.getElementById('create');
let home = document.getElementById('home');
let title = document.getElementById('title');
let desc = document.getElementById('desc');
let filename = document.getElementById('filename');
let search = document.getElementById('search');
search.style.color = "blue";
create.style.color = "blue";

let real = [];
let _undefined = release(arr);

for(var i = 0; i < 10; i++){
  let tmp = "vote" + i;
  if(document.getElementById(tmp)){
    real.push(document.getElementById(tmp));
  }
}

let flag = true;

for(var j = 0; j < real.length; j++){
  real[j].addEventListener('click', function(e){

    let make = new XMLHttpRequest();
    let trgt = Number(e.target.id.toString().substring(4))+1;
    let path = "https://voteit.glitch.me/fetch?file=" + filename.getAttribute('value') + "&vote=vote" + trgt;

    let outgoing = new XMLHttpRequest();
    outgoing.open("POST", 'https://voteit.glitch.me/test' , true);
    outgoing.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    outgoing.onreadystatechange = function(){

      if(XMLHttpRequest.DONE === 4 && outgoing.status == 200){
        console.log("Goose says quack");
        if(this.response && flag){
          make.open("GET", path, true);

          make.setRequestHeader("Authorization", _undefined);

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

reload.addEventListener('click', function(){window.location.reload(true);});
create.addEventListener('click', function(){location = 'https://voteit.glitch.me/create'});
home.addEventListener('click', function(){location = 'https://voteit.glitch.me/'});
search.addEventListener('click', function(){location = 'https://voteit.glitch.me/search'});