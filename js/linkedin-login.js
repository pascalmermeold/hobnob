var access_token;
var db;
var pushNotification;

var linkedinapi = {
  authorize: function(options) {
    var deferred = $.Deferred();

    //Build the OAuth consent page URL
    var authUrl = 'https://www.linkedin.com/uas/oauth2/authorization?' + $.param({
      client_id: options.client_id,
      redirect_uri: options.redirect_uri,
      response_type: 'code',
      state: 'adazd324234Fs1413'
    });

    //Open the OAuth consent page in the InAppBrowser
    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

    //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
    //which sets the authorization code in the browser's title. However, we can't
    //access the title of the InAppBrowser.
    //
    //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
    //authorization code will get set in the url. We can access the url in the
    //loadstart and loadstop events. So if we bind the loadstart event, we can
    //find the authorization code and close the InAppBrowser after the user
    //has granted us access to their data.
    $(authWindow).on('loadstart', function(e) {
      var url = e.originalEvent.url;

      var code = /\?code=(.+)&state=.+$/.exec(url);
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        //Always close the browser when match is found
        authWindow.close();
      }

      if (code) {
        //Exchange the authorization code for an access token via our server
        $.get('http://0.0.0.0:3000/access_token?code='+code[1]).done(function(data) {
          deferred.resolve(data);
        }).fail(function(response) {
          deferred.reject(response.responseJSON);
        });
      } else if (error) {
        //The user denied access to the app
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

  loginVerif();
  $loginButton.on('click', function() {
    linkedinapi.authorize({
      client_id: '77mmcb71lyvzps',
      redirect_uri: 'http://0.0.0.0:3000'
    }).done(function(data) {
      $loginStatus.html(data.access_token);
      access_token = data.access_token;
      initDb();
    }).fail(function(data) {
      $loginStatus.html(data.error);
    });
  });
});


function loginVerif() {
  alert("logVerif");
  db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
  db.transaction(queryTokenDB, errorCB);
}
function queryTokenDB(tx) {
  alert("queryTokenDB");
  tx.executeSql("SELECT value FROM OPTIONS", [], querySuccessInit, errorCB);
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
  $.get("http://0.0.0.0:3000/hello").done(function(res) {
    alert("OK");
    alert(res);
  }).fail(function(res) {
    alert("NOK");
    alert(res);
  });
}
function errorCB(err) {

}
function successCB() {

}

//
// //Write and Read of a local file on mobile
// function initWrite() {
//   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsWrite, fail);
// }
// function initRead() {
//   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsRead, fail);
// }
//
//
// function gotFsWrite(fileSystem) {
//   fileSystem.root.getFile("localUserInfo", {create: true, exclusive: false}, gotFileEntryWrite, fail);
// }
// function gotFsRead(fileSystem) {
//   fileSystem.root.getFile("localUserInfo", {create: true, exclusive: false}, gotFileEntryRead, fail);
// }
//
//
// function gotFileEntryWrite(fileEntry) {
//   fileEntry.createWriter(gotFileWriter, fail);
// }
//
// function gotFileEntryRead(fileEntry) {
//   fileEntry.file(gotFileReader, fail);
// }
//
//
// function gotFileWriter(writer) {
//   writer.onwriteend = function(evt) {
//     // alert(access_token);
//   };
//   writer.write("Access Token: " + access_token );
// }
//
// function gotFileReader(file){
//   readAsText(file);
// }
// function readAsText(file) {
//   var reader = new FileReader();
//   reader.onloadend = function(evt) {
//     // alert(evt.target.result);
//   };
//   reader.readAsText(file);
// }
//
//
// function fail(error) {
//   alert("Error on saving your token localy");
//   // alert(error.code);
// }
