/*
 * Canvasクラス
 * このクラスでそのCanvasの情報を扱います。
 * Canvasとはその画面のことです。
 *
 *
 * とりあえず作ってみていて、今はまだ取り込んでいません。。。
 */

var Canvas = function(canvasid){
  //publicメンバ
  //初期化
  this.id = canvasid;  //キャンバス固有のid
  this.postit_list = new Array(); //キャンバスにあるポストイットのリスト
  this.postitid = 0; //ポストイットの数
  this.postit_color = 0;//キャンバスが指定している色
  this.selected;//キャンバス上で選択されているポストイット
  this.sessionid = sessionid;//セッションid
  this.description = description;//キャンバスの説明

  return this;
}

Postit.prototype = {
  init:function(){
  },
  show:function(){
  },
  send:function(){ 
  }
}
