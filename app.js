
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, fs = require('fs')
, mysql = require('mysql')
, socketIO = require('socket.io')
, wson = require('./wson');

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
  console.log('index access');
  res.render('index.ejs', {
    layout: false
  });
});

app.get('/admin',function(req,res){
  console.log('admin access');
  res.render('admin.ejs', {
    layout: false
  });
});


var postit_list = new Array();

/*
 * ソケットが接続してきたときの処理
 */

socket.on('connection',function(client){
  console.log(client.id + 'が接続しました。');
  client.on('hakushu', wson.hakushu(client));
  client.on('tukkomi', wson.tukkomi(client));
  client.on('disconnect',wson.disconnect(client));
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

