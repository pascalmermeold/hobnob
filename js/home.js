var urlPic;
var firstName;
var lastName;
var lastJob;
var lastSchool;

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

$('#goSettings a').on('click', function(){

  alert("HELLO");
  var $pic = $('#profil_pic_sett');
  var $name = $('#profil_name_sett');
  var $job = $('#profil_lastjob_sett');
  var $school = $('#profil_lastschool_sett');

  $pic.append("<img src='" + urlPic + "'>");
  $name.append(firstName + " " + lastName);
  $job.append(lastJob);
  $school.append(lastSchool);
});

function getRandom() {
  var $pic = $('#profil_pic_home');
  var $name = $('#profil_name_home');
  var $job = $('#profil_lastjob_home');
  var $school = $('#profil_lastschool_home');

  $.get("http://0.0.0.0:3000/random?access_token="+access_token).done(function(res) {
    urlPic = res[0].picture_url,
    $pic.append("<img src='" + res[0].picture_url + "'>");
    firstName = res[0].first_name;
    lastName = res[0].last_name
    $name.append(res[0].first_name + " " + res[0].last_name);
    lastJob = res[0].headline;
    $job.append(res[0].headline);
    lastSchool = res[0].last_school;
    $school.append(res[0].last_school);
  }).fail(function(res) {
    alert("Error");
    mainView.loadPage('login.html');
  });
}
