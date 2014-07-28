function getSettings() {
  var $pic = $('#profil_pic_sett');
  var $name = $('#profil_name_sett');
  var $job = $('#profil_lastjob_sett');
  var $school = $('#profil_lastschool_sett');

  $pic.append("<img src='" + urlPic + "'>");
  $name.append(firstName + " " + lastName);
  $job.append(lastJob);
  $school.append(lastSchool);
};

$$('.logoutButton').on('touchend', function (e) {
    alert("Ssup");
    initSettingsDb();
});

function initSettingsDb() {
  db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
  db.transaction(destroyDB, settingsErrorCB, settingsSuccessCB);
}
function destroyDB(tx) {
  tx.executeSql("DROP TABLE IF EXISTS OPTIONS");
}
function settingsErrorCB(err) {
  alert("Error " + err);
}
function settingsSuccessCB() {
  mainView.loadPage('login.html',false);
}
