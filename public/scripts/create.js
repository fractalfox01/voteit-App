let number = document.getElementById('number');
let filename = document.getElementById('filename');
let submit = document.getElementById('submit');
let home = document.getElementById('home');
let search = document.getElementById('search');
let choicenames = document.getElementById('choicenames');

console.log("working");

home.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/";
});

search.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/search";
});

number.addEventListener('keyup',function(){
  console.log("number focusout");
  console.log(!choicenames.hasChildNodes());
  if(!choicenames.hasChildNodes()){
    for(var t = 0; t < number.value; t++){
      let node = document.createElement("INPUT");
      node.setAttribute("type","text");
      node.setAttribute("name","choice[choice" + (t+1) + "]");
      node.setAttribute("style","width:100px;height:50px;");
      node.setAttribute("required", "true");
      choicenames.appendChild(node);
    }
  }

});

filename.addEventListener('keypress', function(e){
  let tmp = e.which;
  if(tmp === 32){

    return false;
  }
});
filename.addEventListener('focusout', function(){
  console.log("focusout");
  let count = 0;
  let check = filename.value;
  for(var k = 0; k < check.length; k++){
    if(check[k] == " "){
      count++;
    }
  }
  if(count != 0){
    submit.disabled = true;
    submit.style['background-color']  = "#f00";
  }else{
    submit.disabled = false;
    submit.style['background-color'] = "#eee";
  }
});
