var mysql = require('mysql');

var TEST_DATABASE = 'classy';
var TEST_TABLE = 'class';
var client = mysql.createClient({
  user:'root',
  password:'',
  database:'classy'
});

client.query('SELECT * FROM classes',
             function select(err, results,fields){
               if(err){
                 throw err;
               }

               console.log(results);
               console.log(fields);
               client.end();
             });

client.query('INSERT INTO classes(name,description) VALUES(?,?)',['日本語はどうだ！','testdec'],a);

function a(err, results, fields){
  console.log(err);
  console.log(results);
  console.log(fields);
}
