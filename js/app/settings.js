function initSettings() {
  $('#distance').on('change mousemove',function() {
    $('.distance').text($(this).val()+'km');
  });
  $('#distance').on('change',function() {
    database.sql_query("DELETE FROM OPTIONS WHERE key = 'distance'", function() {});
    database.sql_query("INSERT INTO OPTIONS (key, value) VALUES ('distance', '" + $(this).val() + "')", function() {});     
  });
  $('#disconnect-button').bind('click', function() {
    database.sql_query("DELETE FROM OPTIONS WHERE key = 'access_token'", function() {});
    mainView.loadPage('login.html');
  });

  $('#send-feedback').bind('click', sendFeedback);
}

function loadSettings() {
  setDistance();
}

function setDistance() {
  database.sql_query("SELECT value FROM OPTIONS WHERE key = 'distance'", function(tx, res) {
    options['distance'] = res.rows.item(0).value;
    $('#distance').val(options['distance']);
    $('.distance').text(options['distance']+'km');
  }, function() {});
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