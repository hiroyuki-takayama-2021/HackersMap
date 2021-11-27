'use strict';

// モジュール
const express = require( 'express' );
const http = require( 'http' );
const path = require('path');
const os = require('os');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const mysql = require('mysql');
const notice = require('./private/notice');
const option = require('./private/option.json');

// オブジェクト
const app = express();
const server = http.Server( app );

// 定数
const PORT = process.env.PORT || 3000;

let mysql_setting = {
  host : option.mysql_host,
  user : option.mysql_user,
  password : option.password,
  database : option.database
};
let marker_table = option.Trouble_Table_name;
let polyline_table = option.Polyline_Table_name;

// 公開フォルダの指定
app.use( express.static( __dirname + '/public' ) );
app.use( express.static( __dirname + '/svg' ) );
app.use( express.static( __dirname + '/node_modules' ) );

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.engine('ejs',ejs.renderFile);

function whoAccess(req){
  var address = notice.getipClient(req);
  console.log("\n"+req.url+" "+req.method+" : from["+address+"]");
  return address;
}

function modeSelector(mode){
  if(mode==="mark"){
    return marker_table;
  }else if(mode==="draw"){
    return polyline_table;
  }else{
    console.log("Unexpected Error Occur. This mode is not exist.");
    return null;
  }
}

/*
//毎秒投稿禁止 & フォーム送信
function postLimitter(address, sql_setting, table, info){
  var connection = mysql.createConnection(sql_setting);
  connection.connect();

  connection.query("SELECT * FROM "+table+" WHERE date=(select Max(date) from "+table+") and ip_address='" + address + "'",
  function(error, results, fields){
  if(error==null){
    console.log("");
    let last_post_time = results[0].date;
    last_post_time.setHours(last_post_time.getHours() + 9);
    let post_time = new Date();
    let dif = post_time - last_post_time;
    console.log("The difference is " + dif + " milli seconds");
    console.log("")

    if(dif > 20000){
      connection.query('INSERT INTO '+table+' SET ?', info,
      function(error, results, fields){
        if(error==null){
          console.log("posted info");
        }else{
          console.log(error);
        }
      });
    }else{
      console.log("too much POST in shot time!");
    }
  }else{
    console.log(error);
  
  connection.end();
  }
  });
}
*/

app.get("/",(req,res)=>{
    whoAccess(req);
    res.render('index.ejs',{});
});

app.post("/",(req,res)=>{
    let ip_address = whoAccess(req);
    let date = new Date();

    let info = {
      "title": req.body.title,
      "lat": req.body.lat,
      "lng": req.body.lng,
      "details": req.body.details,
      "danger": req.body.danger,
      "ip_address": ip_address
    };
    info["date"] = date.toISOString();

    console.log(req.body);

    connection.query('INSERT INTO '+table+' SET ?', info,
      function(error, results, fields){
        if(error==null){
          console.log("posted info");
        }else{
          console.log(error);
        }
      });
    res.render('redirecting.ejs',{});
});

app.post("/post_test",(req,res)=>{
    whoAccess(req);

    console.log(req.body);
    res.render('index.ejs',{});
});

app.get("/search",(req,res)=>{
    whoAccess(req);
    res.render('search.ejs',{});
});

app.get("/sql",(req,res)=>{
    whoAccess(req);
    res.writeHead(301, { Location: option.public_ip + "phpmyadmin" });
    res.end();
});

app.get("/maintain",(req,res)=>{
  whoAccess(req);
  res.render('maintain.ejs',{});
});

app.get("/test",(req,res)=>{
  whoAccess(req);
  res.render('test.ejs',{});
});

app.get("/ajax",(req,res)=>{
    whoAccess(req);
    let mode = req.query.mode;
    let table = modeSelector(mode);

    console.log(mode+" mode, the table is "+table);

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM '+table,
      function(error, results, fields){
        if(error==null){
          console.log("ajax get well done!");
          res.json(results);
        }else{
          console.log(error);
        }
      }
    );
    connection.end();
});

app.post("/ajax_delete",(req,res)=>{
    whoAccess(req);
    let date = new Date();
    let info = req.body.postid;
    let mode = req.body.mode;
    let table = modeSelector(mode);
    let page = req.body.page;
    console.log(mode+" mode, the table is "+table);

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('DELETE FROM '+table+' WHERE postid = ?', info,
      function(error, results, fields){
        if(error==null){
          console.log("PostId : "+info+" was deleted.");
        }else{
          console.log(error);
        }
      }
    );
    connection.end();

    res.render(page,{});
});

app.get("/database",(req,res)=>{
    whoAccess(req);
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('SELECT * FROM '+table,
      function(error, results, fields){
        if(error==null){
          console.log("Good!");
          res.render('database.ejs',
            {
              title : 'mysql',
              content : results
            });
        }else{
          console.log(error);
        }
      }
    );
    connection.end();
});

app.get("/draw",(req,res)=>{
  whoAccess(req);
  res.render('draw.ejs',{});
});

app.post("/draw",(req,res)=>{
  let ip_address = whoAccess(req);
  let date = new Date();

  let info = {
    "title": req.body.title,
    "lat1": req.body.lat1,
    "lng1": req.body.lng1,
    "lat2": req.body.lat2,
    "lng2": req.body.lng2,
    "details": req.body.details,
    "danger": req.body.danger,
    "ip_address": ip_address
  };
  info["date"] = date.toISOString();

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('INSERT INTO '+polyline_table+' SET ?', info,
    function(error, results, fields){
      if(error==null){
        console.log("posted info");
      }else{
        console.log(error);
      }
    }
  );

  connection.end();
  const queryObject = url.parse(req.url,true).query;
  console.log(queryObject);
  res.render('draw_redirecting.ejs',{});
});

//-------------------------------------------------------------------------------------------------------------------------

// サーバーの起動
server.listen(
    PORT,
    () =>{
        console.log( 'Server on port %d', PORT );
        console.log(notice.getip());
    }
);
