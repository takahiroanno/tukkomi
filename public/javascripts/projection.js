var socket;
var postitid = 0;
var postit_color = 0; //0 = yellow,1=red,2=green,3=blue
var postit_list = new Array();
var selected;
var canvas_id;
var canvas_z_index = 100;
//linkをドラッグしている状態かそうでないか。
//0はドラッグしていない
//1はしている。
var link_stat = 0;

//onlinkはlinkしようとしているpostit
var onlink;

var color_array = {
  'yellow-button' : 0,
  'red-button' : 1,
  'green-button' : 2,
  'blue-button' : 3
};
var is_full = 0;
//ページの初期化処理
$(function(){
  param();

  //initializing websocket connection
  //通信系
  //
  //socket = io.connect('http://ec2-175-41-233-244.ap-northeast-1.compute.amazonaws.com');
  socket = io.connect('http://localhost');
  
  socket.on('message',function(msg){
    addmessage(msg.img_url,msg.name,msg.text,msg.tw_id);
  });
  socket.on('connection',function(){ 
    console.log(socket.socket.sessionid);
  });
  socket.on('iine',function(id){
    changeiine(id);
  });
  socket.on('newpostit',function(obj){
    console.log(obj);
    if(obj.canvas_id == canvas_id){
      var postit = new Postit(obj.text,obj.color,obj.sessionid,obj.postitid);
      postit_list.push(postit);
    }
  });
  socket.on('rmpostit',function(obj){
    console.log('rm:' + obj.sessionid + ':' + obj.postitid);
    var postit = getpostitbyid(obj.sessionid,obj.postitid);
    postit.remove();
  });
  socket.on('mvpostit',function(obj){
    var postit = getpostitbyid(obj.sessionid,obj.postitid);
    postit.elem.css({'top':obj.top,'left':obj.left});
  });
  socket.on('linking',function(obj){
    if(obj.canvas_id == canvas_id){
      var postit = getpostitbyid(obj.obj1_sessionid,obj.obj1_id);
      var postit2 = getpostitbyid(obj.obj2_sessionid,obj.obj2_id);
      postit_linking(postit,postit2);
    }
  });
  socket.on('canvasinfo',function(obj){
    console.log(obj);
    console.log(obj.id);
    set_canvas_title(obj.name);
  });
  socket.on('init',function(obj){
    console.log(obj);
    var len = obj.length;
    console.log(len);
    for(var i = 0;i < len;i++){
      if(obj[i].deleted == 0){
        console.log(obj[i]);
        var postit = new Postit(obj[i].passage,obj[i].color_code,obj[i].session_id,obj[i].postit_id,canvas_id);
        postit.elem.css({'top':obj[i].postop,'left':obj[i].posleft});
        postit_list.push(postit);
      }
    }
    
    //link情報を取得
    socket.emit('linkinit',{id:canvas_id});
  });

  socket.on('linkinit',function(obj){
    console.log(obj);
    for(var i = 0;i < obj.length;i++){
      var p1 =  getpostitbyid(obj[i].p1_session_id,obj[i].p1_id);
      var p2 =  getpostitbyid(obj[i].p2_session_id,obj[i].p2_id);
      console.log(p1);
      console.log(p2);
      postit_linking(p1,p2);
    }
  });
  // -- 以上通信系初期化 -- //
  //socket.emit('init', {id:canvas_id}); 
  socket.emit('initwithpass',{id:canvas_id,pass:canvas_pass});
  socket.emit('getcanvasinfo',{id:canvas_id});
  // -- ページの初期化 -- // 
  //color-buttonsの初期化
  $("#yellow-button").live("click",colorclick);
  $("#red-button").live("click",colorclick);
  $("#green-button").live("click",colorclick);
  $("#blue-button").live("click",colorclick);

  $("#delete-button").click(function(){
    console.log('rm');
    selected.remove();
    socket.emit('rmpostit',{
      'sessionid' : selected.sessionid,
      'postitid' : selected.id,
      'canvas_id' : canvas_id
    });
  });

  // -- 以上ページの初期化 --//
});


function colorclick(){
  $this = $(this);
  $('.color-button').removeClass('active');
  $this.addClass('active'); 

  postit_color = color_array[this.id];
}


function sendclick(){
  var text = $("#input02").val();
  if(text == ""){
    return false;
  }
  var postit = new Postit(text,postit_color,socket.socket.sessionid,postitid);
  postitid++;
  postit_list.push(postit);
  postit.send();
  $("#input02").val("");
  return false;
}


function switchtextarea(){
  if($("#inputarea").css('display') == 'none'){
    $("#inputarea").fadeIn();
    $("#switchtextareabutton").addClass("active");
  }else{
    $("#inputarea").fadeOut();
    $("#switchtextareabutton").removeClass("active");
  }
}

function switchfull(){
  if(is_full){
    //full screen 解除
    if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else {
      document.exitFullscreen();
    }
    is_full = 0;
    $('#fullbutton').removeClass('active');
  }else{
    //full screen nisuru
    elem = document.getElementById('testwrapper');
    if (elem.requestFullScreen) {
      elem.requestFullScreen();
    } else if (elem.mozRequestFullScreen) {  
      elem.mozRequestFullScreen();  
    } else if (elem.webkitRequestFullScreen) {  
      elem.webkitRequestFullScreen();  
    }
    is_full = 1;
    $('#fullbutton').addClass('active');
  }
}


function getpostitbyid(sessionid,postitid){
  for(var i = 0;i < postit_list.length;i++){
    var tmp = postit_list[i];
    if(tmp.id == postitid && tmp.sessionid == sessionid){
      return tmp;
    }
  }
  return false;
}

function set_canvas_title(title){
  console.log(title);
  $('#canvastitle h1').text(title);
}

function param(){
  var pram=location.search;
  if(pram.length < 1){
    window.location = './canvases';
  }
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
  canvas_id = key['id'];
  canvas_pass = key['pass'];
}


