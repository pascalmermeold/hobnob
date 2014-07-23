function getRandom() {
  var $pic = $('#profil_pic');
  var $name = $('#profil_name');
  var $job = $('#profil_job');
  var $school = $('#profil-school');

  alert("getRandom");
  $.get("http://0.0.0.0:3000/random?access_token="+access_token).done(function(res) {
    alert("OK");
    alert(res.first_name);
    // $pic.append();
    alert(res.last_name);
    $name.append();
    // alert(res.first_name);
    // alert(res.last_name;)
    $job.append();
    // alert(res.headline);
    $school.append();
    // alert(res.last_school);
  }).fail(function(res) {
    alert("NOK");
  });
}
