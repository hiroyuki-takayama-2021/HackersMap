'use strict';

// モジュール
const express = require( 'express' );
const http = require( 'http' );
const path = require('path');
const os = require('os');
const fs = require('fs');
const ejs = require('ejs');
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
let table = option.Trouble_Table_name;

// 公開フォルダの指定
app.use( express.static( __dirname + '/public' ) );
app.use( express.static( __dirname + '/svg' ) );
app.use( express.static( __dirname + '/node_modules' ) );

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.engine('ejs',ejs.renderFile);

app.get("/",(req,res)=>{
    console.log("/get");
    res.render('index.ejs',{});
});

app.post("/",(req,res)=>{
    console.log("/post");
    let date = new Date();

    let info = {
      "title": req.body.title,
      "lat": req.body.lat,
      "lng": req.body.lng,
      "details": req.body.details,
      "danger": req.body.danger,
      "ip_address": "Mr.Nobody"
    };
    info["date"] = date.toISOString();

    console.log(req.body);

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query('INSERT INTO '+table+' SET ?', info,
      function(error, results, fields){
        if(error==null){
          console.log("posted info");
        }else{
          console.log(error);
        }
      }
    );

  connection.end();
    res.render('redirecting.ejs',{});
});

app.post("/post_test",(req,res)=>{
    console.log("/post");

    console.log(req.body);
    res.render('index.ejs',{});
});

app.get("/search",(req,res)=>{
    console.log("/search get");
    res.render('search.ejs',{});
});

app.get("/sql",(req,res)=>{
    console.log("/sql");
    res.writeHead(301, { Location: option.public_ip + "phpmyadmin" });
    res.end();
});

app.get("/maintain",(req,res)=>{
  console.log("/maintain get");
  res.render('maintain.ejs',{});
});

app.get("/test",(req,res)=>{
  console.log("/test get");
  res.render('test.ejs',{});
});

app.get("/ajax",(req,res)=>{
    console.log("/ajax get");
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

//ポストはajaxでしないことに決めました。
//今は保守用に残してるだけです。

app.post("/ajax_delete",(req,res)=>{
    console.log("/ajax_delete");
    let date = new Date();
    let info = req.body.postid;

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
    res.render('index.ejs',{});
});

app.get("/database",(req,res)=>{
    console.log("/database get");
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

// サーバーの起動
server.listen(
    PORT,
    () =>{
        console.log( 'Server on port %d', PORT );
        console.log(notice.getip());
    }
);
