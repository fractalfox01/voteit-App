const home = document.getElementById('home');
const create = document.getElementById('create');
const search = document.getElementById('search');

home.addEventListener('click', function(){
  location = "https://voteit.glitch.me/";
});
create.addEventListener('click', function(){
  location = "https://voteit.glitch.me/create";
});
search.addEventListener('click', function(){
  location = "https://voteit.glitch.me/search";
});