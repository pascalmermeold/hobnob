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
