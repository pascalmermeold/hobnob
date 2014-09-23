function initHomePage() {
  if(just_logged_in) {
    howToModal();
    just_logged_in = false;
  }

  $('.heading, .footer').bind('click', switchDetails);
  
  getRandom();
}

function getRandom() {
  geolocateForRandomRequest();
}

function geolocateForRandomRequest() {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {timeout: 10000, enableHighAccuracy: true});
}

function randomRequest(latitude, longitude, accuracy) {
  $.get(server_url + "/random?access_token="+access_token+"&type="+options['search_type']+"&tag="+options['selected_tag']+"&latitude="+latitude+"&longitude="+longitude+"&accuracy="+accuracy+"&distance="+options['distance']).done(function(res) {
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
  console.log(error.code);
  console.log(error.message);
}

function add_swiping_profile(profile, index, array) {
  sleep(500);
  add_swipe(profile, function(accepted, id) {
    if (accepted === true) {
      fadingModal("Cool !");
      mark = 1
    }
    else {
      fadingModal("Bof...");
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

function howToModal() {
  myApp.modal({
    title:  'Comment ça marche ?',
    text: 'Un profil vous intéresse ? Glissez vers la droite. Bof ? Glissez le vers la gauche.',
    buttons: [
      {
        text: 'Ok, compris !',
        bold: true
      }
    ]
  });
}

function fadingModal(text) {
  myApp.modal({
    title: text
  });
  setTimeout(function () {
      myApp.closeModal();
  }, 1000);
}

function switchDetails(e) {
  $(this).parents('.swipe').find('.details').slideToggle();
}