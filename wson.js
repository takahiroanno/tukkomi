/*
 * wson module
 * このモジュールはwebsocketでイベントが起きた時に
 * 呼び出されるfunctionです。
 */

exports.setmodel = function(model){
  this.model = model;
  this.pass = "ilabannote";
}

exports.init = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + "がcanvas_id=" + obj.id + "に接続しました。");
    model.get_postits(obj.id,client);
  }
};

exports.getcanvasinfo = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + "がcanvas_id=" + obj.id + "のcanvasinfoをget");
    model.get_canvas_by_id(obj.id,function(results){
      client.emit('canvasinfo',results[0]);
    });
  }
};

exports.initwithpass = function(client){
  var model = this.model;
  var pass = this.pass;
  return function(obj){
    console.log(client.id + "がcanvas_id=" + obj.id + "に接続しました。");
    console.log("pass is " + obj.pass + "ですね。");
    console.log('一方正解は' + pass);
    if(obj.pass == pass){
    model.get_postits(obj.id,client);
    }
  }
};

exports.linkinit = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + "がcanvas_id=" + obj.id + "のリンクを要求しました。");
    model.get_links(obj.id,client,
    function(err,results,fields){
      console.log(results);
      client.emit('linkinit',results); 
    });
  }
};

exports.disconnect = function(client){
  var model = this.model;
  return function(){
    console.log(client.id + "が切断しました");
  }
};

exports.newpostit = function(client){
  var model = this.model;
  return function(obj){
    //本来であればemitする対象を絞らなければならない。
    console.log(client.id + 'がnew postit');
    client.broadcast.emit('newpostit',obj);
    model.add_new_postit(obj); 
  }
};

exports.rmpostit = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + 'がrmpostit');
    client.broadcast.emit('rmpostit',obj);
    model.rm_postit(obj); 
  }
};


exports.stoppostit = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + 'がstoppostit canvas_id:'+ obj.canvas_id + ' top:'+ obj.top+ 'left:' + obj.left);
    client.broadcast.emit('mvpostit',obj);
    model.set_postit_pos(obj);
  }
};


exports.mvpostit = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + 'がmvpostit canvas_id:'+ obj.canvas_id + ' top:'+ obj.top+ 'left:' + obj.left);
    client.broadcast.emit('mvpostit',obj);
  }
};

exports.linking = function(client){
  var model = this.model;
  return function(obj){
    console.log(client.id + 'がlinking をしました。');
    client.broadcast.emit('linking',obj);

    model.get_postit_id(obj.obj1_id,obj.obj1_sessionid,obj.canvas_id,
      function(err,results){
        model.get_postit_id(obj.obj2_id,obj.obj2_sessionid,obj.canvas_id,
          function(err2,results2){
            console.log(results[0].id);
            console.log(results2[0].id);
            model.set_postit_linking(results[0].id,results2[0].id);
          });
      });
  }
}
