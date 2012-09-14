var socket;
var loadFlg = false;
var aud = document.getElementById('mixAud');

//ページの初期化処理
$(function(){
  init();
  //socket = io.connect('http://ec2-175-41-233-244.ap-northeast-1.compute.amazonaws.com');
  //socket = io.connect('http://localhost');
  socket = io.connect('http://ec2-54-248-6-226.ap-northeast-1.compute.amazonaws.com');

  socket.on('hakushu',function(obj){
    start_hakushu();
  });

  socket.on('tukkomi',function(obj){
    start_tukkomi();
  });
  
  $("#tukkomi-button").click(function(){
    tukkomi(1);
  });

  $("#hakushu-button").click(function(){
    hakushu();
    preload();
    pl();
  });
  // -- 以上ページの初期化 --//
});

function tukkomi(id){
  console.log('nandeyanen btn pushed!');
  socket.emit('tukkomi',{
    'id' : id
  });
}
function hakushu(){
  console.log('hakushu btn pushed!');
  socket.emit('hakushu',{
  });
}

function start_hakushu(){
  console.log('hakushu');
  pl();
}

function start_tukkomi(){
  console.log('tukkomi');
  pl();
}


function preload(){
  aud.load();
  if(!loadFlg){ 
  }else{
    window.alert('standby already');
  }
}

aud.addEventListener('canplay',function(){
  if(!loadFlg){
    window.alert('standby');
  }
  loadFlg = true;
  }
,true);

function pl(){
  aud.play();
}
