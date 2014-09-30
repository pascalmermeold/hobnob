function initSettings() {
  $('#distance').on('change mousemove',function() {
    $('.distance').text($(this).val()+'km');
  });

  $('#save-settings').bind('click', function() {
    database.save_option('distance',$('#distance').val());
    database.save_option('selected_tag', $('#tag').val().toLowerCase());
    options['distance'] = $('#distance').val();
    options['selected_tag'] = $('#tag').val();
  });
  
  $('#disconnect').bind('click', function() {
    database.sql_query("DELETE FROM OPTIONS WHERE key = 'access_token'", function() {});
    mainView.loadPage('login.html');
  });

  $('#tag').bind('keyup', function() {
    $(this).val($(this).val().toLowerCase());
  });

  setDistance();
  setTag();
}

function setDistance() {
  $('#distance').val(options['distance']);
  $('.distance').text(options['distance']+'km');
}

function setTag() {
  $('#tag').val(options['selected_tag']);
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

function loadProfileHeading() {
  $('#profile-pic').attr('src',options['user_picture_url']);
  $('#profile-name').html(options['user_name']);
}