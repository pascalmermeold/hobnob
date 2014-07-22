var access_token;
var db;
var pushNotification;

var linkedinapi = {
  authorize: function(options) {
    var deferred = $.Deferred();

    var authUrl = 'https://www.linkedin.com/uas/oauth2/authorization?' + $.param({
      client_id: options.client_id,
      redirect_uri: options.redirect_uri,
      response_type: 'code',
      state: 'adazd324234Fs1413'
    });

    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

    $(authWindow).on('loadstart', function(e) {
      var url = e.originalEvent.url;

      var code = /\?code=(.+)&state=.+$/.exec(url);
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        authWindow.close();
      }

      if (code) {
        $.get('http://0.0.0.0:3000/access_token?code='+code[1]).done(function(data) {
          deferred.resolve(data);
        }).fail(function(response) {
          deferred.reject(response.responseJSON);
        });
      } else if (error) {
        deferred.reject({
          error: error[1]
        });
      }
    });

    return deferred.promise();
  }
};


$(document).on('deviceready', function() {
  var $loginButton = $('#login a');
  var $loginStatus = $('#login p');

  var $testButton = $('#test a');
  var $testStatus = $('#test p');

  $testButton.on('click', function() {
    initPushNotif();
  });

  tokenCheck();
  $loginButton.on('click', function() {
    linkedinapi.authorize({
      client_id: '77mmcb71lyvzps',
      redirect_uri: 'http://0.0.0.0:3000'
    }).done(function(data) {
      $loginStatus.html(data.access_token);
      access_token = data.access_token;
      initDb();
      mainView.loadPage('home.html');
    }).fail(function(data) {
      $loginStatus.html(data.error);
    });
  });
});


function tokenCheck() {
  alert("logVerif");
  db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
  db.transaction(queryTokenDB, queryErrorInit);
}
function queryTokenDB(tx) {
  alert("queryTokenDB");
  tx.executeSql("SELECT value FROM OPTIONS", [], querySuccessInit, queryErrorInit);
}

// PushNotification
function initPushNotif() {
  alert("INIT PUSHNOTIF");
  pushNotification = window.plugins.pushNotification;
  pushNotification.register(tokenHandler,errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
}
function onNotificationAPN (event) {
  if ( event.alert ){
    navigator.notification.alert(event.alert);
  }

  if ( event.sound ){
    var snd = new Media(event.sound);
    snd.play();
  }

  if ( event.badge ){
    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }
}
function successHandler (result) {
    alert('result = ' + result);
}
function errorHandler (error) {
    alert('error = ' + error);
}
function tokenHandler (result) {
  // Your iOS push server needs to know the token before it can push to this device
  // here is where you might want to send it the token for later use.
  alert('device token = ' + result);
}

// DB on local mobile
function initDb() {
  alert("INITDB");
  db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
  db.transaction(populateDB, errorCB, successCB);
}
function populateDB(tx) {
  alert("POPULATE");
  tx.executeSql("DROP TABLE IF EXISTS OPTIONS");
  tx.executeSql("CREATE TABLE IF NOT EXISTS OPTIONS (id unique, key, value)");
  tx.executeSql("INSERT INTO OPTIONS (id, key, value) VALUES (1, 'access_token', '" + access_token + "')" );
}
function queryDB(tx) {
  tx.executeSql('SELECT * FROM OPTIONS', [], querySuccess, errorCB);
}
// Query the success callback
//
function querySuccess(tx, res) {
  alert("token is " +  res.rows.item(0).value);
}
function querySuccessInit(tx, res) {
  alert("token is " +  res.rows.item(0).value);
  $.get("http://0.0.0.0:3000/hello?access_token="+res.rows.item(0).value).done(function(res) {
    alert("OK");
    mainView.loadPage('home.html');
    $.get("http://0.0.0.0:3000/random").done(function(res) {
      alert("OK");
    }).fail(function(res) {
      alert("NOK");
    });
  }).fail(function(res) {
    alert("NOK");
  });
}
function queryErrorInit(err) {
  alert("Error. Try to login.");
}
function errorCB(err) {

}
function successCB() {

}
