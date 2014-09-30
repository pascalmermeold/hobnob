function initHomePage() {
  if(just_logged_in) {
    initSettings();
    myApp.popup('.popup-settings');
    just_logged_in = false;
  }
  
  getRandom();
  stopPreload('home');
}

function getRandom() {
  geolocateForRandomRequest();
}

function geolocateForRandomRequest() {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {timeout: 5000, enableHighAccuracy: true});
}

function randomRequest(latitude, longitude, accuracy) {
  $.get(server_url + "/random?access_token="+access_token+"&tag="+options['selected_tag']+"&latitude="+latitude+"&longitude="+longitude+"&accuracy="+accuracy+"&distance="+options['distance']).done(function(res) {
    res.forEach(add_profile);
    $('.loader').hide();
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
  });
}

function geolocationSuccess(position) {
  randomRequest(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
}

function geolocationError(error) {
  alert("La géolocalisation ne fonctionne pas sur votre smartphone. Vous devez activer le GPS et autoriser HobNob à y accéder pour que l'application fonctionne.");
}

function add_profile(profile, index, array) {
  var rendered = Mustache.render($('#swipe_template').html(), profile);
  var highest_index = 0;
  $('.swipe').each(function() {
    var current_index = parseInt($(this).css("zIndex"), 10);
      if(current_index > highest_index) {
          highest_index = current_index;
      }
  });

  $('.swipes').append(rendered);
  new_swipe = $('.swipes #' + profile['id']);
  new_swipe.css('zIndex',highest_index + 1);
  new_swipe.find('.yes').bind('click', {id: profile['id']}, yes);
  new_swipe.find('.nope').bind('click', {id: profile['id']}, nope);

  slider = myApp.slider('.swipes #' + profile['id'] + ' .slider-container');
  new_swipe.find('.info').bind('click', {slider: slider}, nextSlide);
}

function yes(e) {

  $('.show-yes').fadeIn(100);
  setInterval(function() {
    $('.show-yes').fadeOut(100);
    $('#' + e.data.id).remove();
  }, 500);
  

  if($('.swipes .swipe').size() < 2) {
    getRandom();
  }

  $.get(server_url + "/new_mark?access_token="+access_token+"&linkedin_id="+e.data.id+"&mark=1");
}

function nope(e) {
  
  $('.show-nope').fadeIn(100);
  setInterval(function() {
    $('.show-nope').fadeOut(100);
    $('#' + e.data.id).remove();
  }, 500);

  if($('.swipes .swipe').size() < 2) {
    getRandom();
  }

  $.get(server_url + "/new_mark?access_token="+access_token+"&linkedin_id="+e.data.id+"&mark=0");
}

function nextSlide(e) { 
  slider = e.data.slider;
  if (slider.isLast) {
    slider.slideTo(0,500);
  } else {
    slider.slideNext();
  }
}

function switchDetails(e) {
  $(this).parents('.swipe').find('.details').slideToggle();
}