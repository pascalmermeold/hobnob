function initHomePage() {
  if(just_logged_in) {
    initSettings();
    myApp.popup('.popup-settings');
    just_logged_in = false;
  }
  $('.loader').hide();
  getRandom();
}

function getRandom() {
  geolocateForRandomRequest();
}

function geolocateForRandomRequest() {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {timeout: 10000, enableHighAccuracy: true});
}

function randomRequest(latitude, longitude, accuracy) {
  $.get(server_url + "/random?access_token="+access_token+"&tag="+options['selected_tag']+"&latitude="+latitude+"&longitude="+longitude+"&accuracy="+accuracy+"&distance="+options['distance']).done(function(res) {
    res.forEach(add_swiping_profile);
    $('.loader').hide();
  }).fail(function(res) {
    mainView.loadPage('login.html');
  });
}

function geolocationSuccess(position) {
  randomRequest(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
}

function geolocationError(error) {
  alert("La géolocalisation ne fonctionne pas sur votre smartphone. Vous devez activer le GPS et autoriser HobNob à y accéder pour que l'application fonctionne.");
}

function add_swiping_profile(profile, index, array) {
  sleep(500);
  add_swipe(profile, function(accepted, id) {
    if (accepted === true) {
      mark = 1;
    }
    else {
      mark = 0;
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

function switchDetails(e) {
  $(this).parents('.swipe').find('.details').slideToggle();
}