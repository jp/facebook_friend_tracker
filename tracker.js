var app_id = 370823446374093;

window.fbAsyncInit = function() {
  FB.init({
      appId      : app_id, // App ID
      channelUrl : '//localhost:3000/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
      $('#login').toggleClass('logged-in');
      $('#login').removeClass('login');
      spyFriends();
    }
  });
}

function spyFriends(){
  FB.api('/me/friends', function(friends) {
    $.each(friends.data, function(index, friend) {
      FB.api('/'+friend.id+'/checkins', function(response) {
        traceFriend(friend,response.data);
      });
    });
  });
}

function traceFriend(friend,data){
  var coordinates = [];
  var markerLayer = [];
  $.each(data, function(index, value) {
    coordinates.push([value.place.location.longitude,value.place.location.latitude])
    var label="";
    if (value.place.location.city !== undefined)
      label += value.place.location.city
    label += ' - '+friend.name

    marker = L.marker([ value.place.location.latitude,value.place.location.longitude ]).bindPopup(label);
    markerLayer.push(marker);
  });

  layer = L.featureGroup(markerLayer)
  map.addLayer(layer);

  L.geoJson({
      "type": "LineString",
      "coordinates": coordinates
    }, {
    style: {
      "color": getRandomColor(),
      "opacity": 0.65
    }
  }).addTo(map);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}