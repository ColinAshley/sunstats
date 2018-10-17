// functions
function getData() {
  // Request data for entered location (default: Winnersh, Berkshire, UK)
  let lat = document.getElementById("lat").value;
  let long = document.getElementById("long").value;
  let date = document.getElementById("date").value;

  fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}&date=${date}`, {
    // nothing here
    }).then(response => response.json())
    .then(showData)
    .catch(e => requestError(e, 'Error'));
  }

function showData(data) {
    dataitem = data['results'];
    sunlist = '<tr><th>Event</th><th>Time(UTC)</th></tr>';
    for ( const [sunKey, sunValue] of Object.entries(dataitem)) {
      sunlist += (`<tr><td>${sunKey}</td><td>${sunValue}</td></tr>`);
      if (sunKey == 'civil_twilight_end') {
        break;
      }
    }
  sunstats[0].innerHTML = sunlist;
  footer[0].innerHTML = 'Data supplied by https://sunrise-sunset.org/';
  saveLocalData();
}

function requestError(e, part) {
    console.log(e);
}

function getLoc() {
    navigator.geolocation.getCurrentPosition( geoSuccess, geoError, {enableHighAccuracy: true } );
}

function geoSuccess(pos) {
  let geolat = pos.coords.latitude;
  document.getElementById('lat').value = geolat;
  let geolng = pos.coords.longitude;
  document.getElementById('long').value = geolng;
  getPlaceName(geolat, geolng);
}

function geoError(err) {
  // Set lat/long/date defaults (Earley)
  let geolat = '51.999999';
  document.getElementById('lat').value = geolat;
  let geolng = '-0.999999';
  document.getElementById('long').value = geolng;
  getPlaceName(geolat, geolng);
}

function getPlaceName(Glat,Glng) {
  let geocoder = new google.maps.Geocoder;
  let latlng = {lat: parseFloat(Glat), lng: parseFloat(Glng)};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        let placeText = document.getElementById('placeName');
        placeText.innerHTML = (results[0].formatted_address);
        placeText.style.color = 'white';
        placeText.style.background = 'green';
      }
    }
  });
}

function saveLocalData() {
  let lat = document.getElementById("lat").value;
  let lng = document.getElementById("long").value;
  window.localStorage.setItem('lat', lat );
  window.localStorage.setItem('lng', lng );
}

function readLocalData() {
  lat = window.localStorage.getItem('lat' );
  lng = window.localStorage.getItem('lng');
  document.getElementById("lat").value = lat;
  document.getElementById("long").value = lng;
}

// main code
// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js');
  });
}

document.getElementById('date').valueAsDate = new Date();

// Get table ready
const sunstats = document.getElementsByClassName("sunstats");
const footer = document.getElementsByClassName("footer");
let sunlist = ``;
let timezoneOffset = new Date().getTimezoneOffset();
readLocalData();