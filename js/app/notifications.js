function registerPushNotification() {
  pushNotification = window.plugins.pushNotification;
  if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
      // pushNotification.register(
      // successHandler,
      // errorHandler,
      // {
      //     "senderID":"replace_with_sender_id",
      //     "ecb":"onNotification"
      // });
  } else {
      pushNotification.register(
      tokenHandler,
      errorHandler,
      {
          "badge":"true",
          "sound":"true",
          "alert":"true",
          "ecb":"onNotificationAPN"
      });
  }
}

function tokenHandler (result) {
  // Your iOS push server needs to know the token before it can push to this device
  // here is where you might want to send it the token for later use.
  $.get(server_url + "/register_phone?access_token="+access_token+"&token="+result+"&platform="+device.platform).done(function(res) {
    return true;
  }).fail(function(res) {
    alert('error when registering phone');
    return false;
  });
}

function errorHandler (error) {
    alert('error = ' + error);
}

// iOS
function onNotificationAPN (event) {
  if (parseInt(event.foreground)) {
    inAppNotification(event);
    //inAppBadge(event.badge);

    if(mainView.activePage.name == 'contacts') {
      loadContacts();
    }
  } else {
    if (event.url) {
      mainView.loadPage(event.url);
    }
  }

  if ( event.in_app_alert ) {
    alert(event.in_app_alert);
  }

  // Nothing after that, it's not taken in account

  if ( event.alert ) {
    navigator.notification.alert(event.alert);
  }

  if ( event.sound ) {
    var snd = new Media(event.sound);
    snd.play();
  }

  if ( event.badge ) {
    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }
}

function inAppNotification(event) {
  myApp.addNotification({
    title: 'HobNob',
    message: event.alert,
    media: '<img width="44" height="44" style="border-radius:100%" src="' + event.media + '">',
    hold: 8000,
    closeOnClick: true,
    closeIcon: false,
    onClick: function(e) {
      mainView.loadPage(event.url);
    }
  });
}

function inAppBadge(badge) {
  if(parseInt(badge) > 0) {
    $('.contacts-button i').append('<span class="badge badge-green">'+ badge + '</span>');
  }
}