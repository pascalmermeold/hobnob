function initSettings() {
  startPreload('settings', 'chargement');

  setSettingsNavbar();
  setSettingsHeading();

  $('#distance').on('change mousemove',function() {
    d = $(this).val();
    $('.distance').text(d +'km');
    database.save_option('distance', d);
    options.distance = d;
  });

  loadEventSelector();
  
  $('#disconnect').bind('click', function() {
    database.sql_query("DELETE FROM OPTIONS WHERE key = 'access_token'", function() {});
    mainView.loadPage('login.html');
  });

  setDistance();
}

function loadEventSelector() {
  $.get(server_url + "/close_events?access_token="+access_token+"&tag="+options.tag).done(function(res) {
    var event_items = res.event_items;

    if(event_items.length === 0) {
      $('#event-selector').hide();
    } else {
      var rendered = Mustache.render($('#event-items').html(), res);
      $('#event-selector li').remove();
      $('#event-selector ul').append(rendered);

      $('#event-selector a').bind('click', function() {
        var tag = $(this).data('tag');
        database.save_option('tag', tag);
        options.tag = tag;

        mainView.loadPage('home.html');
      });

      $('#event-selector').show();
      $('#custom-event-menu').hide();
      
      $('.heading').waitForImages(function() {  
        stopPreload('settings');
      });
    }
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
    $('#event-selector').hide();
    $('#custom-event-menu').hide();
    stopPreload('settings');
  });
}

function setDistance() {
  $('#distance').val(options.distance);
  $('.distance').text(options.distance+'km');
}

function sendFeedback() {
  myApp.prompt("Un bug ? Une idée d'amélioration ?", 'Feedback', 
    function (value) {
      $.get(server_url + "/feedback?access_token="+access_token+"&text="+value).done(function(res) {
        myApp.alert('Merci !');
      }).fail(function(res) {
        myApp.alert("Oups, ça n'a pas fonctionné... Un petit mail à pascal@lafactoria.fr pour corriger ça, merci !");
      });
      
    }
  );
}

function setSettingsHeading() {
  if(options.picture_url) {
    $('#profile-pic').css('background-image','url(' + options.picture_url + ')');
  }
  $('#profile-name').text(options.name);
}

function setSettingsNavbar() {
  if(options.tag) {
    $('.navbar .right a').attr('href','home.html');
    $('.navbar .right a i').removeClass('fa-users');
    $('.navbar .right a i').addClass('fa-home');
  } else {
    $('.navbar .right a').attr('href','index.html');
    $('.navbar .right a i').removeClass('fa-home');
    $('.navbar .right a i').addClass('fa-users');
  }
}