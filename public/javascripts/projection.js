var socket;

//ページの初期化処理
$(function(){
  param();
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
  play();
}
function start_tukkomi(){
  console.log('tukkomi');
  play2();
}


function param(){
  var pram=location.search;
  /* 引数がない時はcanvasesへ */
  if (!pram) return false;
  /* 先頭の?をカット */
  pram=pram.substring(1);
  /* 「&」で引数を分割して配列に */
  var pair=pram.split("&");
  var i=temp="";
  var key=new Array();
  for (i=0; i < pair.length; i++) {
    /* 配列の値を「=」で分割 */
    temp=pair[i].split("=");
    keyName=temp[0];
    keyValue=temp[1];
    /* キーと値の連想配列を生成 */
    key[keyName]=keyValue
  }
}
