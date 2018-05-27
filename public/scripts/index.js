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