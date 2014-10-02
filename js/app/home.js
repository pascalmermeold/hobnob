function initHome() {
  startPreload('home', 'chargement');

  if (options.tag) {
    loadEvent();
  } else {
    mainView.loadPage('settings.html');
  }

  $('#quit-event').bind('click', function() {
    database.save_option('tag', '');
    options.tag = '';
    mainView.loadPage('settings.html');
  });
}

function loadEvent() {
  $.get(server_url + "/event_custom_menu?access_token="+access_token+"&tag="+options.tag).done(function(res) {
    var rendered = Mustache.render($('#menu-items').html(), res);
    $('#custom-event-menu .menu-item').remove();
    $('.event-logo').attr('src',res.logo_url);
    $('#custom-event-menu ul').prepend(rendered);
    $('#custom-event-menu').show();
    $('#event-selector').hide();
    stopPreload('home');
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
    $('#custom-event-menu').hide();
    $('#event-selector').hide();
    stopPreload('home');
  });   
}
