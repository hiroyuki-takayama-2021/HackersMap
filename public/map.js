let place = [34.48170262662108,-224.57353055466228];
var map = L.map('map',{
  center: place,
  zoom: 17
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
*/

map.on('click', function(e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;
    L.popup()
        .setLatLng(L.latLng(lat, lng))
        .setContent("lat:"+lat+",lng:"+lng)
        .openOn(map);
    /*L.popup()
        .setLatLng(L.latLng(lat, lng))
        .setContent('<form id="popup-form">\
                     <label for="input-accident">Details:</label>\
                     <input id="input-accident" class="popup-input" type="textarea" /><br>\
                     <label for="input-lebel">Danger:</label>\
                     <input id="input-lebel" class="popup-input" type="number" min="1" max="5" />\
                     <button id="button-submit" type="button">Report</button>\
                     </form>')
        .openOn(map);*/
    //L.marker([lat,lng]).bindPopup("マーカーをクリックしました。").addTo(map);

} );
