let create = document.getElementById('create');
let search = document.getElementById('search');
let about = document.getElementById('about');

create.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/create";
});
search.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/search";
});
about.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/about";
});

let github = document.getElementById('github');
let email = document.getElementById('email');

github.addEventListener('click', function(){
  if(email.checked){
    email.checked = false;
  }
});
email.addEventListener('click', function(){
  if(github.checked){
    github.checked = false;
  }
});
