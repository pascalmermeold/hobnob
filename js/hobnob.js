// Initialize your app
var myApp = new Framework7();
var access_token;
var pushNotification;

var options = {};
options.lang = 'en-US';
var just_logged_in = false;

var server_url = 'http://hobnobapp.herokuapp.com';
//var server_url = 'http://0.0.0.0:3000';

// Export selectors engine
var $$ = Framework7.$;

var mainView = myApp.addView('.main-view', {
	dynamicNavbar: true
});

// Device ready handler
$(document).on('deviceready', function() {
	i18n.init({ lng: options.lang, resGetPath: 'locales/__lng__/__ns__.json' });
	navigator.globalization.getPreferredLanguage(successGlobalization, errorGlobalization);
	database.init();
	checkOptions();
});

// Page init handlers
$$(document).on('pageInit', function (e) {

	page = e.detail.page;

	$('.page').i18n();

  	switch(page.name) {
	  	case 'login':
	  		initLoginPage();
	  		break;
	  	case 'random':
	  		initRandom();
	  		break;
	  	case 'home':
	  		initHome();
	  		break;
	  	case 'contacts':
	  		loadContacts();
	  		break;
	  	case 'chat':
	  		initChat(page.query.linkedin_id);
	  		break;
	  	case 'profile':
	  		initProfile();
	  		break;
	  	case 'settings':
	  		initSettings();
	  		break;
	  	case 'external':
	  		initExternal(page.query.pagename, page.query.pageurl);
	  		break;
	}

});

function checkAccessToken() {
	database.sql_query("SELECT value FROM OPTIONS WHERE key = 'access_token'", setAccessTokenAndHello, wrongAccessToken);
}

function checkOptions() {
	database.fetch_option('distance', 10);
	database.fetch_option('tag', '');
}

function setAccessTokenAndHello(tx, res) {
	access_token = res.rows.item(0).value;
	$.get(server_url + "/hello?access_token=" + access_token + "&lang=" + options.lang).done(function(res) {
		console.log('hello ok');
		options.name = res.user.first_name + " " + res.user.last_name;
		options.picture_url = res.user.picture_url;
		registerPushNotification();
		initRandom();
	}).fail(function(res, textStatus, errorThrown) {
		mainView.loadPage('login.html');
	});
}

function initLoginPage() {
	var $loginButton = $('#login a');

    $loginButton.on('click', function() {
    	startPreload('login','connexion');
		linkedinapi.authorize().done(function(data) {
			access_token = data.access_token;
			database.save_option('access_token', access_token);
			checkAccessToken();
			mainView.loadPage('index.html');
			just_logged_in = true;
			stopPreload('login');
		}).fail(function(data) {
			alert('Problème de connexion');
			stopPreload('login');
		});
	});	
}

function wrongAccessToken() {
	mainView.loadPage("login.html");
}

function startPreload(page, text) {
	$('div[data-page=' + page + ']').children().hide();
	$('div[data-page=' + page + ']').prepend('<div class="loader"> <div class="spinner2"><div class="double-bounce1"></div><div class="double-bounce2"></div></div><span>' + text + '</span></div>');
}

function stopPreload(page) {
	$('div[data-page=' + page + ']').children().show();
	$('div[data-page=' + page + ']').find('.loader').remove();
}

function successGlobalization(language) {
	options.lang = language.value;
	checkAccessToken();
	i18n.setLng(options.lang, function(t) { 
		$('body').i18n();
	});
	
}

function errorGlobalization() {
	alert('globalization error');
}
