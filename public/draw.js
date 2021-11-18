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
    <input id="lat" name="lat1" type="hidden" value="`+latlngs[0]+`">
    <input id="lng" name="lng1" type="hidden" value="`+latlngs[1]+`">
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


