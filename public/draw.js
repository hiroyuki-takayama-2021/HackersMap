'use strict';

let place = [34.48170262662108,-224.57353055466228];
var map = L.map('map',{
  center: place,
  zoom: 17
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//-----------------------------------------------------------------------------------------------------------------------------------------------

var polyline = [];
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
      polyline[i] = L.polyline([data[i].lat, data[i].lng])
                   .bindPopup(popup_info).addTo(map)
                   .on( 'click', function(e) { $(ajax_delete(e.target.postid)); })
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

//-----------------------------------------------------------------------------------------------------------------------------------------------

function ajax_delete(postid){
  $.ajax({
  timeout: 1000,
  type: "POST",
  url: "/ajax_delete",
  data: {
    "postid": postid,
  },
  dataType: "json",
  beforeSend: ()=>{
    $("log").text("Now Deleting... Hold on a second.");
  }
  }).done(function(data){
    //L.polyline([lat,lng]).bindPopup("追加された").addTo(map);
  }).fail(function( XMLHttpRequest, textStatus, errorThrown ) {
    if(textStatus == "timeout"){
    //alert(JSON.stringify(XMLHttpRequest) +" : "+ errorThrown+" : "+textStatus); //なんかtimeoutする。左はチェック用
    console.log("connection is timeout. but it's no problem.");
    }
  }).always(function(data, textStatus, errorThrown) {
    window.location.reload();
  })
}

//-----------------------------------------------------------------------------------------------------------------------------------------------

let firstClick = false;
let latlngs = [];
map.on('click', function(e){

  if(firstClick === false){
    firstClick = true;
    console.log(firstClick);
    let latlng = [e.latlng.lat, e.latlng.lng];
    latlngs.push(latlng)
  }else{
    firstClick = false;
    let latlng = [e.latlng.lat, e.latlng.lng];
    latlngs.push(latlng);

    var contentPopup = `
    <style>
    button[type="submit"] {
    	width: 40%;
        font-size: 15px;
        color: #fff;
    	display: inline-block;
        padding: 15px 0px;
        text-align: center;
    	background-color: #3980f9;
        border: 1px solid #5c87a6;
        border-radius: 5px;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 1s;
    }

    button[type="submit"]:hover {
        color: #3980f9;
        background-color: #ffffff;
        border: 3px solid #5c87a6;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color .5s;
    }

    .stars span{
      display: flex;               /* 要素をフレックスボックスにする */
      flex-direction: row-reverse; /* 星を逆順に並べる */
      justify-content: flex-end;   /* 逆順なので、左寄せにする */
    }

    .stars input[type='radio']{
      display: none;               /* デフォルトのラジオボタンを非表示にする */
    }

    .stars label{
      color: #D2D2D2;              /* 未選択の星をグレー色に指定 */
      font-size: 30px;             /* 星の大きさを30pxに指定 */
      padding: 0 5px;              /* 左右の余白を5pxに指定 */
      cursor: pointer;             /* カーソルが上に乗ったときに指の形にする */
    }

    .stars label:hover,
    .stars label:hover ~ label,
    .stars input[type='radio']:checked ~ label{
      color: #F8C601;              /* 選択された星以降をすべて黄色にする */
    }
    </style>

    <form method="post" action="/draw">
    <div class="cp_iptxt">
      <label class="ef">
        <p>タイトル</p><input name="title" type="text" minlength="2" maxlength="20" size="20" required="required" placeholder="手短に何が起きてる？">
        <p>詳細</p><input name="details" type="text" minlength="5" maxlength="50" size="50" required="required" placeholder="詳細を書いてください。">
        <p>危険度</p>
      </label>
    </div>
    <div class="review">
      <div class="stars">
        <span>
          <input id="review01" type="radio" name="danger" value="5"><label for="review01">☢</label>
          <input id="review02" type="radio" name="danger" value="4"><label for="review02">☢</label>
          <input id="review03" type="radio" name="danger" value="3"><label for="review03">☢</label>
          <input id="review04" type="radio" name="danger" value="2"><label for="review04">☢</label>
          <input id="review05" type="radio" name="danger" value="1" checked><label for="review05">☢</label>
        </span>
      </div>
    </div>
    <input id="lat" name="lat1" type="hidden" value="`+latlngs[0][0]+`">
    <input id="lng" name="lng1" type="hidden" value="`+latlngs[0][1]+`">
    <input id="lat" name="lat2" type="hidden" value="`+latlngs[1][0]+`">
    <input id="lng" name="lng2" type="hidden" value="`+latlngs[1][1]+`">
    <div class="cp_iptxt">
      <label class="ef">
        <button type="submit">Submit</button>
      </label>
    </div>
    </form>
    `;

    var popup = L.popup({ minWidth: 300, maxHeight: 550 })
    .setLatLng(latlng)
    .setContent(contentPopup)
    .openOn(map);

    L.polyline(latlngs, {color:"black"}).addTo(map);
    latlngs = []
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------


