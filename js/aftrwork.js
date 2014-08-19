// Initialize your app
var myApp = new Framework7();
var access_token;
//var server_url = 'http://aftrwork.herokuapp.com';
var server_url = 'http://0.0.0.0:3000';

// Export selectors engine
var $$ = Framework7.$;

var mainView = myApp.addView('.view-main');

//var settingsView = myApp.addView('.view-settings');

//var chatView = myApp.addView('.view-chat');

// Device ready handler
$(document).on('deviceready', function() {
	mainView.hideNavbar();
	mainView.hideToolbar();
	database.init();
	checkAccessToken();
});

// Page init handlers
$$(document).on('pageInit', function (e) {
  // Page Data contains all required information about loaded and initialized page
  var page = e.detail.page

  if (page.name == 'login') {
  	mainView.hideNavbar();
	mainView.hideToolbar();
    initLoginPage();
  }
  if (page.name == 'home') {
  	mainView.showNavbar();
	mainView.showToolbar();
    initHomePage();
  }
  if (page.name == "settings") {
    getSettings();
  }
});

function checkAccessToken() {
	database.sql_query("SELECT value FROM OPTIONS WHERE key = 'access_token'", setAccessTokenAndHello, wrongAccessToken);
}

function setAccessTokenAndHello(tx, res) {
	access_token = res.rows.item(0).value;
	$.get(server_url + "/hello?access_token=" + access_token).done(function(res) {
		mainView.loadPage('home.html',false);
	}).fail(function(res, textStatus, errorThrown) {
		mainView.loadPage('login.html',false);
	});
}

function initLoginPage() {
	var $loginButton = $('#login a');
    var $loginStatus = $('#status');

    $loginButton.on('click', function() {
		linkedinapi.authorize().done(function(data) {
			access_token = data.access_token;
			database.sql_query("DELETE FROM OPTIONS WHERE key = 'access_token'", function() {});
			database.sql_query("INSERT INTO OPTIONS (id, key, value) VALUES (1, 'access_token', '" + access_token + "')", function() {});
			mainView.loadPage('home.html',false);
		}).fail(function(data) {
			$loginStatus.html(data);
		});
	});
}

function wrongAccessToken() {
	mainView.loadPage("login.html");
}
function initHomePage() {
	getRandom();
}
