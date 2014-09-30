function registerPushNotification() {
  pushNotification = window.plugins.pushNotification;
  if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
      pushNotification.register(
      successHandler,
      errorHandler,
      {
          "senderID":"52505588173",
          "ecb":"onNotification"
      });
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

function successHandler (result) {
}

function errorHandler (error) {
    alert('error = ' + error);
}

// Android and Amazon Fire OS
function onNotification(e) {
  alert('notif');
  alert(e.event);
  alert(e.regid);
  switch( e.event )
  {
  case 'registered':
    if ( e.regid.length > 0 )
    {
      $.get(server_url + "/register_phone?access_token="+access_token+"&token="+e.regid+"&platform="+device.platform).done(function(res) {
        return true;
      }).fail(function(res) {
        alert('error when registering phone');
        return false;
      });
    }
  break;

  case 'message':
    // if this flag is set, this notification happened while we were in the foreground.
    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
    if ( e.foreground )
    {

      //inAppNotification(event);
    }
    else
    {  
      // if (event.t == 'message') {
      //   mainView.loadPage('chat.html?linkedin_id=' + event.s);
      // }
    }
    // if ( event.badge ) {
    //   pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    // }    
  break;

  case 'error':
      alert('error = ' + e.msg);
  break;
  }
}

// iOS
function onNotificationAPN (event) {
  notification = {};
  notification['foreground'] = parseInt(event.foreground);
  notification['type'] = event.t;

  if(event.t == 'message') {
    notification['title'] = event.alert;
    notification['sender_id'] = event.s;
  }

  if(event.t == 'match') {
    notification['name'] = event.n;
    notification['picture_url'] = event.p;
    notification['user_id'] = event.u;
  }

  doNotification(notification);

  // if (parseInt(event.foreground)) {
  //   inAppNotification(event);
  // } else {
  //   if (event.t == 'message') {
  //     mainView.loadPage('chat.html?linkedin_id=' + event.s);
  //   }
  // }

  if ( event.badge ) {
    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }
}

// function inAppNotification(event) {
//   if (event.t == 'match') {
//     $('.popup-match').find('.first_name').text(event.n);
//     $('.popup-match').find('.other_user_pic').attr('src', event.p);
//     $('.popup-match').find('.current_user_pic').attr('src', options['user_picture_url']);

//     $('.popup-match').find('.go-to-chat').bind('click', {event: event}, function(e) {
//       myApp.closeModal('.popup-match');
//       mainView.loadPage('chat.html?linkedin_id=' + e.data.event.u);
//     });
    
//     $('.popup-match').waitForImages(function() {
//       myApp.popup('.popup-match');
//     });
//   }
  
//   if (event.t == 'message') {
//     if(mainView.activePage.name == 'chat') {
//       loadLastReceivedMessage(event.s);
//     } else {
//       myApp.addNotification({
//         title: 'HobNob',
//         message: event.alert,
//         media: '<img width="44" height="44" style="border-radius:100%" src="' + event.media + '">',
//         hold: 8000,
//         closeOnClick: true,
//         closeIcon: false,
//         onClick: function(e) {
//           mainView.loadPage(event.url);
//         }
//       });
//     }
//   }
// }

function doNotification(notification) {
  if ((!notification['foreground']) && (notification['type'] = 'message')) {
    mainView.loadPage('chat.html?linkedin_id=' + notification['sender_id']);
  }

  if (notification['type'] == 'match') {
    $('.popup-match').find('.first_name').text(notification['name']);
    $('.popup-match').find('.other_user_pic').attr('src', notification['picture_url']);
    $('.popup-match').find('.current_user_pic').attr('src', options['user_picture_url']);

    $('.popup-match').find('.go-to-chat').bind('click', {user_id: notification['user_id']}, function(e) {
      myApp.closeModal('.popup-match');
      mainView.loadPage('chat.html?linkedin_id=' + e.data.user_id);
    });
    
    $('.popup-match').waitForImages(function() {
      myApp.popup('.popup-match');
    });
  }

  if (notification['type'] == 'message') {
    if(mainView.activePage.name == 'chat') {
      loadLastReceivedMessage(notification['sender_id']);
    } else {
      myApp.addNotification({
        title: 'HobNob',
        message: notification['title'],
        hold: 8000,
        closeOnClick: true,
        closeIcon: false,
        onClick: function(e) {
          mainView.loadPage('chat.html?linkedin_id=' + notification['sender_id']);
        }
      });
    }
  }
}

function inAppBadge(badge) {
  if(parseInt(badge) > 0) {
    $('.contacts-button i').append('<span class="badge badge-green">'+ badge + '</span>');
  }
}