// Initialize your app
var myApp = new Framework7();
var access_token;

//var server_url = 'http://aftrwork.herokuapp.com';
var server_url = 'http://0.0.0.0:3000';

// Export selectors engine
var $$ = Framework7.$;

var mainView = myApp.addView('.main-view');

//var settingsView = myApp.addView('.view-settings');

//var chatView = myApp.addView('.view-chat');

// Device ready handler
$(document).on('deviceready', function() {
	$('.navbar').hide();
	$('.toolbar').hide();
	database.init();
	checkAccessToken();
});

// Page init handlers
$$(document).on('pageInit', function (e) {
  // Page Data contains all required information about loaded and initialized page
  var page = e.detail.page

  if (page.name == 'login') {

    initLoginPage();
  }
  if (page.name == 'home') {
	$('.navbar .back_to_contacts').hide();
  	$('.navbar').show();
	$('.toolbar').show();
	setActive('home');
    initHomePage();
  }
  if (page.name == 'contacts') {
	$('.navbar .back_to_contacts').hide();
  	$('.navbar').show();
	$('.toolbar').show();
	setActive('contacts');
    initContactsPage();
  }
  if (page.name == 'chat') {
  	$('.navbar').show();
  	$('.navbar .back_to_contacts').fadeIn();
	$('.toolbar.tabbar').hide(500);
	setActive('contacts');
	//myApp.initMessagebar('.chat-page');
    initChat(page.query['linkedin_id']);
  }
  if (page.name == "settings") {
    getSettings();
  }
});

function setActive(mode) {
	$('.toolbar a').removeClass('active');
	$('.toolbar .' + mode + '-button').addClass('active');
}

function checkAccessToken() {
	database.sql_query("SELECT value FROM OPTIONS WHERE key = 'access_token'", setAccessTokenAndHello, wrongAccessToken);
}

function setAccessTokenAndHello(tx, res) {
	access_token = res.rows.item(0).value;
	$.get(server_url + "/hello?access_token=" + access_token).done(function(res) {
		mainView.loadPage('home.html');
	}).fail(function(res, textStatus, errorThrown) {
		mainView.loadPage('login.html');
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

function initContactsPage() {
	loadContacts();
}
