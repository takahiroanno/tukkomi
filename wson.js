/*
 * wson module
 * このモジュールはwebsocketでイベントが起きた時に
 * 呼び出されるfunctionです。
 */

exports.setmodel = function(model){
  this.model = model;
}

exports.hakushu = function(client){
  return function(obj){
    console.log('hakushu kassai!');
    client.broadcast.emit('hakushu',obj);
  }
};

exports.tukkomi = function(client){
  return function(obj){
    console.log('tukkomi! type = ' + obj.id);
    client.broadcast.emit('tukkomi',obj);
  }
};

exports.disconnect = function(client){
  return function(obj){
    console.log(client.id + 'がdisconnectしました。');
    client.broadcast.emit('disconnect',obj);
  }
};
