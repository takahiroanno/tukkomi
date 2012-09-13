
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, fs = require('fs')
, mysql = require('mysql')
, socketIO = require('socket.io')
, model = require('./model')
, wson = require('./wson');


/*
 * dbの設定 + model
 */
var db = mysql.createClient({
  user:'root',
  password:'',
  database:'apisnote'
});
model.setdb(db);
wson.setmodel(model);
/*
 * App Configuration
 */
var app = module.exports = express.createServer();
var socket = socketIO.listen(app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  console.log("this is development mode");
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/*
 *  Routes
 */

app.get('/', function(req,res){
  res.render('index.ejs', {
    layout: false
  });
});

app.get('/canvases',function(req,res){
  console.log('canvases access');
  model.get_canvases(res);
});

app.get('/newcanvas',function(req,res){
  model.add_new_canvas(req.query,res); 
});

var postit_list = new Array();

/*
 * ソケットが接続してきたときの処理
 */

socket.on('connection',function(client){
  console.log(client.id + 'が接続しました。');
  client.on('init', wson.init(client));
  client.on('initwithpass', wson.initwithpass(client));
  client.on('disconnect',wson.disconnect(client));
  client.on('newpostit',wson.newpostit(client));
  client.on('rmpostit',wson.rmpostit(client));
  client.on('stoppostit',wson.stoppostit(client));
  client.on('mvpostit',wson.mvpostit(client));
  client.on('linking',wson.linking(client));
  client.on('linkinit',wson.linkinit(client));
  client.on('getcanvasinfo',wson.getcanvasinfo(client));
});

/*
 * listenを開始
 */

app.listen(80, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


/*
 * 例外処理
 */

process.on('uncaughtException',function (err){
  console.log('Caught exception: ' + err);
});

