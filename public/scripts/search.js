let create = document.getElementById('create');
let home = document.getElementById('home');
let foot = document.getElementById('myfooter');

foot.addEventListener('mouseenter', function(){
  foot.innerHTML = "Created By Thomas Vandivier";
});
foot.addEventListener('mouseout', function(){
  foot.innerHTML = "Created By EncodedVoid";
});

console.log("working");

create.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/create";
});

home.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/";
});