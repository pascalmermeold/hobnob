function initSettings() {
  $('#distance').on('change mousemove',function() {
    $('.distance').text($(this).val()+'km');
  });
  $('#distance').on('change',function() {
    database.sql_query("DELETE FROM OPTIONS WHERE key = 'distance'", function() {});
    database.sql_query("INSERT INTO OPTIONS (key, value) VALUES ('distance', '" + $(this).val() + "')", function() {});     
  });
  $('#disconnect-button').bind('click', function() {
    console.log('bind disconnect');
    database.sql_query("DELETE FROM OPTIONS WHERE key = 'access_token'", function() {});
    mainView.loadPage('login.html');
  });
}

function loadSettings() {
  setDistance();
}

function setDistance() {
  database.sql_query("SELECT value FROM OPTIONS WHERE key = 'distance'", function(tx, res) {
    distance = res.rows.item(0).value;
    $('#distance').val(distance);
    $('.distance').text(distance+'km');
  }, function() {});
}