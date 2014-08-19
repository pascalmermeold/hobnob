function getRandom() {
  $.get(server_url + "/random?access_token="+access_token).done(function(res) {
    res.forEach(add_swiping_profile);
  }).fail(function(res) {
    mainView.loadPage('login.html');
  });
}

function add_swiping_profile(profile, index, array) {
  add_swipe(profile, function(accepted, id) {
    if (accepted === true) {
      myApp.alert("Connections OK", "Connections");
    }
    else {
      myApp.alert("Connections NOK", "Connections");
    }
  });
}
