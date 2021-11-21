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
  url: "/ajax",
  dataType: "json",
  data: {
    "mode" : "mark",
  }
  }).done(function( data, textStatus, jqXHR ) {
    $("log").text("Connection All Correct.");
    for(let i = 0;i < data.length;i++){
      var popup_info =
      `<p>タイトル : `+data[i].title+`</p>
      <p>詳細 : `+data[i].details+`</p>
      <p>危険度 : ☢ x `+data[i].danger+`</p>
      <p>投稿日時 : `+data[i].date+`</p>
      `;
      marker[i] = L.marker([data[i].lat, data[i].lng])
                   .bindPopup(popup_info).addTo(map)
      marker[i].on('mouseover', function(e) { this.openPopup(); });
      marker[i].on('mouseout', function(e) { this.closePopup(); });
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

var polyline = [];
$(function(){
  $.ajax({
  type: "GET",
  url: "/ajax",
  dataType: "json",
  data: {
    "mode" : "draw",
  }
  }).done(function( data, textStatus, jqXHR ) {
    $("log").text("Connection All Correct.");
    for(let i = 0;i < data.length;i++){
      var popup_info =
      `<p>タイトル : `+data[i].title+`</p>
      <p>詳細 : `+data[i].details+`</p>
      <p>危険度 : ☢ x `+data[i].danger+`</p>
      <p>投稿日時 : `+data[i].date+`</p>
      `;
      polyline[i] = L.polyline([[data[i].lat1, data[i].lng1],[data[i].lat2, data[i].lng2]])
                   .bindPopup(popup_info).addTo(map)
      polyline[i].on('mouseover', function(e) { this.openPopup(); });
      polyline[i].on('mouseout', function(e) { this.closePopup(); });
      polyline[i].postid = data[i].postid;
      polyline[i].userid = data[i].userid;
      polyline[i].title = data[i].title;
      polyline[i].lat1 = data[i].lat1;
      polyline[i].lng1 = data[i].lng1;
      polyline[i].lat2 = data[i].lat2;
      polyline[i].lng2 = data[i].lng2;
      polyline[i].details = data[i].details;
      polyline[i].danger = data[i].danger;
    }
  }).fail(function( jqXHR, textStatus, errorThrown) {
    $("log").text("Database might be sleeping.");
  })
});
