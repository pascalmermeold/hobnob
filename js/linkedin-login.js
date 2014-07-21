var access_token;
var db;

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

  document.addEventListener("deviceready", initRead, false);
  db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
  db.transaction(populateDB, errorCB, successCB);
  $loginButton.on('click', function() {
    linkedinapi.authorize({
      client_id: '77mmcb71lyvzps',
      redirect_uri: 'http://0.0.0.0:3000'
    }).done(function(data) {
      $loginStatus.html(data.access_token);
      access_token = data.access_token;
      initWrite();
    }).fail(function(data) {
      $loginStatus.html(data.error);
    });
  });
});

function populateDB(tx) {
  tx.executeSql('DROP TABLE IF EXISTS DEMO');
  tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
  tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
  tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function queryDB(tx) {
  tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
  console.log("Returned rows = " + results.rows.length);
  // this will be true since it was a select statement and so rowsAffected was 0
  if (!results.rowsAffected) {
    console.log('No rows affected!');
    return false;
  }
  // for an insert statement, this property will return the ID of the last inserted row
  console.log("Last inserted row ID = " + results.insertId);
}

function errorCB(err) {
  alert("Error processing SQL: "+err.code);
}

function successCB() {
  alert("success!");
  db.transaction(queryDB, errorCB);
}


function initWrite() {
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsWrite, fail);
}
function initRead() {
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsRead, fail);
}


function gotFsWrite(fileSystem) {
  fileSystem.root.getFile("localUserInfo", {create: true, exclusive: false}, gotFileEntryWrite, fail);
}
function gotFsRead(fileSystem) {
  fileSystem.root.getFile("localUserInfo", {create: true, exclusive: false}, gotFileEntryRead, fail);
}


function gotFileEntryWrite(fileEntry) {
  fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileEntryRead(fileEntry) {
  fileEntry.file(gotFileReader, fail);
}


function gotFileWriter(writer) {
  writer.onwriteend = function(evt) {
    // alert(access_token);
  };
  writer.write("Access Token: " + access_token );
}

function gotFileReader(file){
  readAsText(file);
}
function readAsText(file) {
  var reader = new FileReader();
  reader.onloadend = function(evt) {
    // alert(evt.target.result);
  };
  reader.readAsText(file);
}


function fail(error) {
  alert("Error on saving your token localy");
  // alert(error.code);
}
