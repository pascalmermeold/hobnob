function geolocateForRandomRequest() {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {enableHighAccuracy: true });
}

function getRandomFromGeo(latitude, longitude, accuracy) {
  $.get(server_url + "/random?access_token="+access_token+"&type=geo&latitude="+latitude+"&longitude="+longitude+"&accuracy="+accuracy+"&distance="+options['distance']).done(function(res) {
    res.forEach(add_swiping_profile);
  }).fail(function(res) {
    mainView.loadPage('login.html');
  });
}

function getRandomFromTag() {
  $.get(server_url + "/random?access_token="+access_token+"&type=tag&tag="+options['selected_tag']).done(function(res) {
    res.forEach(add_swiping_profile);
  }).fail(function(res) {
    mainView.loadPage('login.html');
  });
}

function geolocationSuccess(position) {
  getRandomFromGeo(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
}

function geolocationError(error) {
  console.log(error.code);
  console.log(error.message);
}

function add_swiping_profile(profile, index, array) {
  sleep(500);
  add_swipe(profile, function(accepted, id) {
    if (accepted === true) {
      mark = 1
    }
    else {
      mark = 0
    }
    $.get(server_url + "/new_mark?access_token="+access_token+"&linkedin_id="+id+"&mark="+mark);

    if($('.swipes .swipe').size() == 1) {
      getRandom();
    }
  });
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}