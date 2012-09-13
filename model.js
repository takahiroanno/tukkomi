/*
 * model module
 * このmoduleでdbとの通信を定義します。
 *
 */


exports.setdb = function(db){
  this.db = db;
}


/*
 * canvas
 */

exports.add_new_canvas = function (query,res){
  this.db.query('INSERT INTO canvases(name,description,add_datetime,mod_datetime,deleted) VALUES(?,?,NOW(),NOW(),0)',
                [query.canvasname,query.desc],
                function(err,results,fields){
                  if(err){
                    throw err;
                  }
                  console.log(results);
                  res.redirect('/?id='+results.insertId);
                });
}

exports.get_canvases = function (res){
  this.db.query('SELECT * FROM canvases WHERE deleted = 0',
                function(err,results,fields){
                  res.render('canvases.ejs',{
                    locals:{
                      results:results
                      ,title:'test'
                    }
                  });
                }); 
}

exports.get_canvas_by_id = function (id, callback) {
  console.log('get_canvas_by_id' + id);
  this.db.query('SELECT * FROM canvases WHERE deleted = 0 AND id = ?',[id],
                function(err, results, fields){
                  console.log(results);
                  callback(results);
                });
}


/*
 * postit
 */

exports.get_postits = function (id,client){
  console.log('get_postits');
  //新しく呼ばれた時に呼ばれる
  this.db.query('SELECT * FROM postits WHERE deleted = 0 AND canvas_id = ?',[id],
                function(err,results,fields){
                  console.log("canvasid="+id+"のポストイットを呼び出しました。");
                  console.log(results);
                  client.emit('init',results); 
                }); 
}


exports.add_new_postit = function (obj){
  console.log('add_new_postit');
  console.log(obj);
  this.db.query('INSERT INTO postits(canvas_id,session_id,postit_id,passage,color_code,postop,posleft)'+
                'VALUES(?,?,?,?,?,100,30)',
  [obj.canvas_id,obj.sessionid,obj.postitid,obj.text,obj.color]);
}

exports.set_postit_pos = function (obj){
  var query = 'UPDATE postits SET posleft = ' + obj.left + ' , postop = ' + obj.top;
  query += ' WHERE canvas_id = ' + obj.canvas_id + ' AND postit_id = ' + obj.postitid + ' AND session_id = ' + obj.sessionid;
  this.db.query(query,function(err,results){
  });
}

exports.rm_postit = function(obj){
  var query = 'UPDATE postits SET deleted = 1';
  query += ' WHERE canvas_id = ' + obj.canvas_id + ' AND postit_id = ' + obj.postitid + ' AND session_id = ' + obj.sessionid;
  this.db.query(query,function(err,results){
  });
}

exports.get_postit_id = function(postit_id,session_id,canvas_id,callback){
  //各種idからpostit_idをやる
  var query = 'SELECT * FROM postits WHERE canvas_id = ' + canvas_id;
  query += ' AND postit_id = ' + postit_id;
  query += ' AND session_id = ' + session_id;
  this.db.query(query,callback);
}





/*
 * link
 */

exports.set_postit_linking = function (id1,id2){
  if(id1 > id2){
    var tmp = id1;
    id1 = id2;
    id2 = tmp;
  }
  var query = 'INSERT INTO links(postit_id,postit_id2) ';
  query += ' VALUES(' + id1 + ',' + id2 + ');';
  console.log(query);
  this.db.query(query,function(err,results){
    console.log(results);
  });
}

exports.get_links = function (id,client,callback){
  console.log('get_links');
  query = 'select p1.postit_id as p1_id,p1.session_id as p1_session_id,p2.postit_id as p2_id,p2.session_id as p2_session_id from links left join postits as p1 on links.postit_id = p1.id left join postits as p2 on links.postit_id2 = p2.id where p1.canvas_id = ?;';
  this.db.query(query
                ,[id]
                ,callback); 
}
