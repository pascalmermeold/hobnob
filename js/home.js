function getRandom() {
  var $pic = $('#profil_pic');
  var $name = $('#profil_name');
  var $job = $('#profil_lastjob');
  var $school = $('#profil_lastschool');

  // alert("getRandom");
  $.get("http://0.0.0.0:3000/random?access_token="+access_token).done(function(res) {
    // alert("OK");
    // alert(res[0].picture_url);
    $pic.append("<img src='" + res[0].picture_url + "'>");
    // alert(res[0].first_name);
    // alert(res[0].last_name);
    $name.append(res[0].first_name + " " + res[0].last_name);
    // alert(res[0].headline);
    $job.append(res[0].headline);
    // alert(res[0].last_school);
    $school.append(res[0].last_school);
  }).fail(function(res) {
    // alert("NOK");
  });
}
