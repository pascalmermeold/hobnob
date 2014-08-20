function getRandom() {
  $.get(server_url + "/random?access_token="+access_token).done(function(res) {
    res.forEach(add_swiping_profile);
  }).fail(function(res) {
    mainView.loadPage('login.html');
  });
}

function add_swiping_profile(profile, index, array) {
  sleep(500);
  add_swipe(profile, function(accepted, id) {
    if (accepted === true) {
      mark = 1
    }
    else {
      mark = 0
    }
    $.get(server_url + "/new_mark?access_token="+access_token+"&linkedin_id="+id+"&mark="+mark).done(function(res) {
      alert('ok');
    }).fail(function(res) {
      alert("Un problème est survenu, merci de réessayer");
    });
  });
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}