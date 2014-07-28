// function errorCB(err) {
//   alert("Error Saving your profil");
// }
//
// function saveProfilError() {
//   alert("Profil Saved");
// }
//
// function saveProfilDB(tx) {
//   tx.executeSql("DROP TABLE IF EXISTS PROFIL");
//   tx.executeSql("CREATE TABLE IF NOT EXISTS PROFIL (id unique, url_pic, first_name, last_name, job, school)");
//   tx.executeSql("INSERT INTO PROFIL (id, url_pic, first_name, last_name, job, school) VALUES (1, '" + urlPic + "','" + firstName + "','" + lastName + "','" + lastJob + "','" + lastSchool"')" );
// }
//
// function saveProfil() {
//   db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
//   db.transaction(saveProfilDB, saveProfilError, saveProfilError);
// };


function getRandom() {
  $.get("http://0.0.0.0:3000/random?access_token="+access_token).done(function(res) {
    res.forEach(add_swiping_profile);
  }).fail(function(res) {
    alert("Error");
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
