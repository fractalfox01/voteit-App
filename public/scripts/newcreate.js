let home = document.getElementById('home');
let search = document.getElementById('search');
let foot = document.getElementById('myfooter');

foot.addEventListener('mouseenter', function(){
  foot.innerHTML = "Created By Thomas Vandivier";
  foot.setAttribute("style","color:#0f0;background-color:#333;");
});
foot.addEventListener('mouseout', function(){
  foot.innerHTML = "Created By EncodedVoid";
  foot.setAttribute("style","color:#000;background-color:none;");
});

home.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/";
});

search.addEventListener('click', function(){
  window.location = "https://voteit.glitch.me/search";
});

let ctx = document.getElementById('mycanvas');
let addLabel = document.getElementById('addlabel');
let removeLabel = document.getElementById('removelabel');
let lbls = document.getElementById('lbls');

let pie = document.getElementById('pie');
let doughnut = document.getElementById('doughnut');
let bar = document.getElementById('bar');
let flag = true;
let number = [];
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function getCon(){
  let labelArr = []
  for(var i = 0; ; i++){
    let tmp_con = "in-label" + i;
    if(document.getElementById(tmp_con)){
      labelArr.push(document.getElementById(tmp_con));
    }else{
      break;
    }
  }
  return labelArr;
}

function getLabels(){
  let labelArr = []
  for(var i = 0; ; i++){
    let tmp_label = "label" + i;
    if(document.getElementById(tmp_label)){
      labelArr.push(document.getElementById(tmp_label));
    }else{
      break;
    }
  }
  return labelArr;
}

function mkLabel(){
  let labels = getLabels();
  let con = getCon();
  setTimeout(function(){
    console.log('');
    let newlbl = document.createElement("LI");
    let a = "in-label"+con.length;
    newlbl.setAttribute("id",a);
    newlbl.setAttribute("class","list-group-item");
    let newIn = document.createElement("INPUT");
    let b = "label"+labels.length;
    newIn.setAttribute("size","6");
    newIn.setAttribute("id",b);
    newIn.setAttribute("type","text");
    newlbl.appendChild(newIn);
    lbls.appendChild(newlbl);
  },100);
}

function rmLabel(){
  let con = getCon();
  //.parentNode.removeChild(element);
  setTimeout(function(){
    let idx = con.length-1;
    con[idx].remove();
  },100);
}

// resetCanvas is a copy/paste from the solution at https://stackoverflow.com/questions/24785713/chart-js-load-totally-new-data
// found by a simple google query. slightly modified version.
var resetCanvas = function () {
  $('#mycanvas').remove(); // this is my <canvas> element
  $('#graph-container').append('<canvas id="mycanvas"><canvas>');
  canvas = document.querySelector('#mycanvas'); // why use jQuery?
  ctx = canvas.getContext('2d');
  ctx.canvas.width = 400; // resize to parent width
  ctx.canvas.height = 400; // resize to parent height

  var x = canvas.width/2;
  var y = canvas.height/2;
  ctx.font = '10pt Verdana';
  ctx.textAlign = 'center';
  ctx.fillText('Example By Thomas VanDivier', x, y);
};

function newRand(){
  return Number(Math.floor(Math.random() * 255) + 1);
}

function make(cType, cLabels, cVotes){
  let tempLabels = [];
  if(cLabels == undefined){
    cLabels = [];
  }
  for(var i = 0; i < cLabels.length; i++){
    console.log(cLabels[i].value);
    tempLabels.push(cLabels[i].value);
  }
  setTimeout(function(){
    console.log("Array:",tempLabels.toString());
    let color1 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color2 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color3 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color4 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color5 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color6 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color7 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color8 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color9 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color10 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color11 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color12 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color13 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color14 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color15 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color16 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color17 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color18 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color19 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color20 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color21 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color22 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color23 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    let color24 = 'rgba('+newRand()+'  ,'+newRand()+', '+newRand()+', 0.5)';
    myChart = new Chart(ctx, {
      type: cType,
      data: {
        labels: (cLabels.length > 0) ? tempLabels : [],
        datasets: [{
          label: '# of Votes',
          data: (cVotes != undefined) ? cVotes : [],
          backgroundColor: [
            color1 ,
            color2,
            color3,
            color4,
            color5,
            color6,
            color7,
            color8,
            color9,
            color10,
            color11,
            color12,
            color13,
            color14,
            color15,
            color16,
            color17,
            color18,
            color19,
            color20,
            color21,
            color22,
            color23,
            color24
          ],
          borderColor: [
            'rgba(132,99,255,1)',
            'rgba(235, 162, 54, 1)',
            'rgba(86, 206, 255, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(137, 42, 97, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  },500);

}

addlabel.addEventListener('click', function(){
  mkLabel();
});
let newflag = true;
lbls.addEventListener('focusout', function(){
  let rnd = Math.floor(Math.random() * 9) + 1;
  number.push(rnd);
  resetCanvas();
  let ga = getLabels();
  setTimeout(function(){
    make("pie", ga, number);
  },500);
});

removelabel.addEventListener('click', function(){
  let rnd = Math.floor(Math.random() * 9) + 1;
  let tt = getLabels();

  setTimeout(function(){
    if(number.length == tt.length){
      number.pop();
    }else if(number.length > tt.length){
      console.log("");
    }else{
      number = [];
      for(var k = 0; k < tt.length; k++){
        number.push(rnd);
      }
    }
    rmLabel();
    resetCanvas();
    let ra;
    setTimeout(function(){
      tt.pop();
    },100);
    setTimeout(function(){
      make("pie", tt, number);
    },700);
  },150);
});

pie.addEventListener('click', function(){
  resetCanvas();
  let lbl = getLabels()
  setTimeout(function(){
    make("pie", lbl, number);
  },200);
});
doughnut.addEventListener('click', function(){
  resetCanvas();
  let lbl = getLabels()
  setTimeout(function(){
    make("doughnut", lbl, number);
  },200);
});
bar.addEventListener('click', function(){
  resetCanvas();
  let lbl = getLabels()
  setTimeout(function(){
    make("bar", lbl, number);
  },200);
});

make("pie", [], number);