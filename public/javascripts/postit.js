/*
 * postitクラス
 */

var Postit = function(text,color,sessionid,postitid){
  //public
  this.id = postitid;
  this.sessionid = sessionid;
  this.text = text;
  this.color = color;
  this.selected = 0;
  this.iine;
  this.elem;
  this.canvas_id = canvas_id;
  this.linked = new Array();
  this.show();
  return this;
}

Postit.prototype = {
  init:function(){
  
  
  },
  show:function(){
    console.log('show'); 
    html = '<div id="p' + this.sessionid +'_' + this.id;
    html += '"class="postit hide color'+ this.color +'">'
    html += '<div class="anch"></div>'
    html += this.text  + '</div>';
    $("#postitwrapper").append(html);
    this.elem = $("#p"+this.sessionid + "_" + this.id);
    var okisa = fontsize(this.text.length);
    this.elem.css('font-size',okisa);
    if(this.text.length % 2 == 0 && this.text.length < 9){
      this.elem.css('text-align','center');
    }
    this.elem.fadeIn("slow");
    this.elem.draggable({'stop':postit_stopping(this),
                        'drag':postit_dragging(this)});
    this.elem.click(postit_click(this));

    this.elem.mouseover(postit_mouseover(this));
    this.elem.mouseout(postit_mouseout(this));
    //link用
    this.elem.find(".anch").draggable({'stop':link_stopping(this),
                                  'drag':link_dragging(this)});
  },
  send:function(){ 
    socket.emit('newpostit',{
      'color':this.color,
      'text':this.text,
      'postitid':this.id,
      'sessionid':this.sessionid,
      'canvas_id':this.canvas_id
    });
  },
  tostring:function(){
    console.log('tostring');
    return {text : this.text}
  },
  topostit:function(obj){
    console.log('topostit');
    this.text = obj.text;
    this.author = obj.author;
    this.id = obj.id;
    this.type = obj.type;
    this.iine = obj.iine;
  },
  remove:function(){
    this.elem.fadeOut(); 
  },
  deselect:function(){
    //他のpostitがselectされた時に行う処理
    this.elem.removeClass('selected-postit');
    this.selected = 0;
    for(var i = 0;i < this.linked.length;i++){
      this.linked[i].elem.removeClass('selected-link');
    }
  },
  select:function(){
    this.elem.addClass('selected-postit');
    this.elem.css('z-index',canvas_z_index+1);
    canvas_z_index++;
    this.selected = 1;
    for(var i = 0;i < this.linked.length;i++){
      this.linked[i].elem.addClass('selected-link');
    }
  }
}

function postit_click(obj){
  return function(){
    if(selected){
    selected.deselect();
    }
    selected = obj;
    selected.select();
  }
}



function postit_mouseout(obj){
  return function(){
    if(link_stat == 1 && !(obj.id == selected.id && obj.sessionid == selected.sessionid) ){
      obj.elem.removeClass('onlink-postit');
      onlink = null;
    }else{
    }
  }
}

function postit_mouseover(obj){
  return function(ui){
    if(link_stat == 1 && !(obj.id == selected.id && obj.sessionid == selected.sessionid) ){
      obj.elem.addClass('onlink-postit');
      onlink = obj;
    }else{
    }
  }
}


function postit_dragging(obj){

  return function(e,ui)
  {
    socket.emit('mvpostit',{
      'sessionid':obj.sessionid,
      'postitid':obj.id,
      'top':ui.position.top,
      'left':ui.position.left,
      'canvas_id':obj.canvas_id
    });

  }
}

function postit_stopping(obj){
  return function(e,ui)
  {
    socket.emit('stoppostit',{
      'sessionid':obj.sessionid,
      'postitid':obj.id,
      'top':ui.position.top,
      'left':ui.position.left,
      'canvas_id':obj.canvas_id
    });

  }
}

function send_newpostit(text){
  socket.emit('newpostit',{
    'color':postit_color,
    'text':text,
    'postitid':postitid-1,
    'sessionid':socket.socket.sessionid,
    'canvas_id':canvas_id
  });
}

function link_dragging(obj){
  return function(e, ui){
  //link_statを更新
  link_stat = 1;
  obj.elem.find('.anch').css({'z-index':'-100'});
  }
}

function link_stopping(obj){
  return function(e, ui){
  //positionを元に戻す
  obj.elem.find('.anch').css({'top':ui.originalPosition.top,
                             'left':ui.originalPosition.left});
  link_stat = 0;
  $('.onlink-postit').removeClass('onlink-postit');
  obj.elem.find('.anch').css({'z-index':'0'});

  if(onlink != null){
    //onlinkとobjをリンクさせる
    postit_linking(obj,onlink);
    send_linking(obj,onlink);
    onlink = null;
  }
  }
}

function postit_linking(obj,onlink){
  var flag = 0;
  //要重複排除のための処理
  if(obj && onlink){
  for(var i = 0;i < obj.linked.length ;i++){
    if(obj.linked[i] == onlink){
      flag = 1;
    }
  }
 
  if(flag == 0){
  obj.linked.push(onlink);
  onlink.linked.push(obj);
  console.log(obj.text + 'と' + onlink.text + 'がリンクされました。');
  }
  }
}


function send_linking(obj,onlink){
  socket.emit('linking',{
    'obj1_id' : obj.id,
    'obj1_sessionid' : obj.sessionid,
    'obj2_id' : onlink.id,
    'obj2_sessionid' : onlink.sessionid,
    'canvas_id' : canvas_id
  });
  console.log('sended');
}

function fontsize(length){
 
    if(length <= 1){
      return '7em';
    }else if(length <= 2){
      return '3.6em';
    }else if(length <= 3){
      return '3.6em';
    }else if(length <= 4){
      return '2.8em';
    }else if(length <= 5){
      return '2.3em';
    }else if(length <= 10){
      return '1.9em';
    }else if(length <= 11){
      return '1.8em';
    }else if(length <= 12){
      return '1.7em';
    }else if(length <= 20){
      return '1.3em';
    }else if(length <= 25){
      return '1.2em'; 
    }else if(length <= 30){
      return '1em';
    }else if(length <= 40){
      return '1em';
    }else if(length <= 50){
      return '0.95em';
    }else if(length <= 60){
      return '0.9em';
    }else{
      return '0.8em';
    }
}
