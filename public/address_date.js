"use strinct";

const mysql = require('mysql');
const http = require( 'http' );
const fs = require("fs");
const path = require("path");
const option = require('../private/option.json');

let mysql_setting = {
    host : option.mysql_host,
    user : option.mysql_user,
    password : option.password,
    database : option.database
  };

let marker_table = option.Trouble_Table_name;
let polyline_table = option.Polyline_Table_name;

var marker_connection = mysql.createConnection(mysql_setting);
marker_connection.connect();

var polyline_connection = mysql.createConnection(mysql_setting);
polyline_connection.connect();



function overWrite(connection, table){
  connection.query("SELECT ip_address, date FROM "+table, 
  function(error, results, fields){
    if(error==null){
      let jsonStr = JSON.stringify(results);
      let jsonObj1 = JSON.parse(jsonStr);

      let jsonStr2 = fs.readFileSync("../json/address_date.json", "utf8");
      let jsonObj2 = JSON.parse(jsonStr2);

      //jsonデータサイズの削減の為に重複するデータを削除したいけど、なんかネットに上がってる方法だとうまくいかないのでとりあえず投稿時間の重複を削除するコードになってます
      let values = [];
      let cleanedJson = margedJson.filter(e => {
        if (values.indexOf(e["date"]) === -1) {
        values.push(e["date"]);
        return e;
        }
      });
      console.log(cleanedJson);

      jsonStr = JSON.stringify(cleanedJson)
      fs.writeFile("../json/address_date.json", jsonStr, function(err) {
        if (err) {
            console.log(err);
        }
        connection.end();
      });
    }else{
      console.log(error);
      connection.end();
    }
  });
};

function sleep(waitMsec) {
  var startMsec = new Date();
 
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

let value = 1;

while(value === 1){
  overWrite(marker_connection, marker_table);
  console.log(111);
  sleep(10000);
  overWrite(polyline_connection, polyline_table);
}


