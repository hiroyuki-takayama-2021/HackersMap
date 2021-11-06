'use strict';

let place = [34.48170262662108,-224.57353055466228];
var map = L.map('map',{
  center: place,
  zoom: 17
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = [];
$(function(){
  $.ajax({
  type: "GET",
  url: "http://localhost:3000/ajax",
  dataType: "json"
  }).done(function( data, textStatus, jqXHR ) {
    $("log").text("Connection All Correct.");
    for(let i = 0;i < data.length;i++){
      marker[i] = L.marker([data[i].lat, data[i].lng])
                   .bindPopup(data[i].date).addTo(map)
                   .on( 'click', function(e) {  $(ajax_delete(e.target.postid)); });
      marker[i].postid = data[i].postid;
      marker[i].userid = data[i].userid;
      marker[i].title = data[i].title;
      marker[i].lat = data[i].lat;
      marker[i].lng = data[i].lng;
      marker[i].details = data[i].details;
      marker[i].danger = data[i].danger;
    }
  }).fail(function( jqXHR, textStatus, errorThrown) {
    $("log").text("Database might be sleeping.");
  })
});

function ajax_delete(postid){
  $.ajax({
  timeout: 1000,
  type: "POST",
  url: "http://localhost:3000/ajax_delete",
  data: {
    "postid": postid,
  },
  dataType: "json",
  beforeSend: ()=>{
    $("log").text("Now Deleting... Hold on a second.");
  }
  }).done(function(data){
    //L.marker([lat,lng]).bindPopup("追加された").addTo(map);
  }).fail(function( XMLHttpRequest, textStatus, errorThrown ) {
    if(textStatus == "timeout"){
    //alert(JSON.stringify(XMLHttpRequest) +" : "+ errorThrown+" : "+textStatus); //なんかtimeoutする。左はチェック用
    console.log("connection is timeout. but it's no problem.");
    }
  }).always(function(data, textStatus, errorThrown) {
    window.location.reload();
  })
}

map.on('click', function(e){
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    //絶対にタイムアウトする原因を特定する。
    //でもデータ自体は送れてるのはなんぞ
    $(function(){
      $.ajax({
      timeout: 1000,
      type: "POST",
      url: "http://localhost:3000/ajax",
      data: {
        "userid": 1,
        "title": "追加された",
        "lat": lat,
        "lng": lng,
        "details": "ようわからん",
        "danger": 1,
        "ip_address": "Mr.Nobody"
      },
      dataType: "json",
      beforeSend: ()=>{
        $("log").text("Now Uploading... Hold on a second.");
      }
      }).done(function(data){
        //L.marker([lat,lng]).bindPopup("追加された").addTo(map);
      }).fail(function( XMLHttpRequest, textStatus, errorThrown ) {
        if(textStatus == "timeout"){
          //alert(JSON.stringify(XMLHttpRequest) +" : "+ errorThrown+" : "+textStatus); //なんかtimeoutする。左はチェック用
          console.log("connection is timeout. but it's no problem.");
        }
      }).always(function(data, textStatus, errorThrown) {
        window.location.reload();
      })
    });
});
