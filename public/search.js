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
