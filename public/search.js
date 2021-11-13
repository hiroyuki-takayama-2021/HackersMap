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
  dataType: "json"
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
                   .bindPopup(popup_info).addTo(map);
      marker[i].on('mouseover', function(e) { this.openPopup(); });
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
