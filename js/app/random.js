function initRandom() {
  setIndexNavbar();
  getRandom();
  $('.refresh-random').bind('click',getRandom);
}

function getRandom() {
  geoLocate(randomRequest);
}

function randomRequest(position) {
  options.latitude = position.coords.latitude;
  options.longitude = position.coords.longitude;
  options.accuracy = position.coords.accuracy;

  $.get(server_url + "/random?access_token="+access_token+"&tag="+options.tag+"&latitude="+options.latitude+"&longitude="+options.longitude+"&accuracy="+options.accuracy+"&distance="+options.distance).done(function(res) {
    res.forEach(add_profile);
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
  });
}

function add_profile(profile, index, array) {
  if(!profile.picture_url) {
    profile.picture_url = 'img/pic-placeholder.png';
  }
  var rendered = Mustache.render($('#swipe_template').html(), profile);
  var highest_index = 0;

  //Get highest index
  $('.swipe').each(function() {
    var current_index = parseInt($(this).css("zIndex"), 10);
      // if(current_index > highest_index) {
      //     highest_index = current_index;
      // }
    $(this).css('zIndex', current_index + 1);
  });

  $('.swipes').append(rendered);
  new_swipe = $('.swipes #s_' + profile.id);
  //new_swipe.css('zIndex',highest_index + 1);
  new_swipe.find('.yes').bind('click', {id: profile.id}, yes);
  new_swipe.find('.nope').bind('click', {id: profile.id}, nope);

  slider = myApp.slider('.swipes #s_' + profile.id + ' .slider-container');
  new_swipe.find('.info').bind('click', {slider: slider}, nextSlide);
}

function yes(e) {

  $('.show-yes').fadeIn(100);
  setInterval(function() {
    $('.show-yes').fadeOut(100);
    $('#s_' + e.data.id).remove();
  }, 500);
  

  if($('.swipes .swipe').length <= 3) {
    getRandom();
  }

  $.get(server_url + "/new_mark?access_token="+access_token+"&linkedin_id="+e.data.id+"&mark=1");
}

function nope(e) {
  
  $('.show-nope').fadeIn(100);
  setInterval(function() {
    $('.show-nope').fadeOut(100);
    $('#s_' + e.data.id).remove();
  }, 500);

  if($('.swipes .swipe').length <= 3) {
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

function setIndexNavbar() {
  if(options.tag) {
    $('.navbar .left a').attr('href','home.html');
    $('.navbar .left a i').removeClass('fa-cog');
    $('.navbar .left a i').addClass('fa-home');
  } else {
    $('.navbar .left a').attr('href','settings.html');
    $('.navbar .left a i').removeClass('fa-home');
    $('.navbar .left a i').addClass('fa-cog');
  }
}