'use strict';

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  mapping();
}

function success(pos) {
  var crd = pos.coords;
  var place = [];
  place[0]=crd.latitude;
  place[1]=crd.longitude;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  mapping(place);
}

navigator.geolocation.getCurrentPosition(success, error, options);

function mapping( place=[34.48170262662108,-224.57353055466228] ){
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
                     .on( 'click', function(e) { $(ajax_delete(e.target.postid)); })
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

  function ajax_delete(postid){
    $.ajax({
    timeout: 1000,
    type: "POST",
    url: "/ajax_delete",
    data: {
      "postid" : postid,
      "mode" : "mark",
      "page" : "index.ejs"
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
      let latlng = [e.latlng.lat, e.latlng.lng];

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

      <form method="post" action="/">
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
      <input id="lat" name="lat" type="hidden" value="`+latlng[0]+`">
      <input id="lng" name="lng" type="hidden" value="`+latlng[1]+`">
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
  });
}
