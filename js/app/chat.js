
// CHAT
// Handle message

var lastMessageTimestamp = 0;
var current_user_first_name;
var current_user_picture_url;
var contact_linkedin_id;
var profile;
  
function initChat(linkedin_id) {
  startPreload('chat', 'chargement du chat');
  loadChatHistory(linkedin_id);
  $$('.messagebar .toolbar-inner .link').on('click', sendMessage);
}

function sendMessage(e) {
  var textarea = $$('.messagebar textarea');
  // Message text
  var messageText = textarea.val().trim();
  // Exit if empy message
  if (messageText.length === 0) return;

  // Empty textarea
  textarea.val('').trigger('change');

  // Add message
  myApp.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: 'sent',
    // Avatar and name:
    avatar: current_user_picture_url,
    name: current_user_first_name,
    // Day
    day: (((new Date())*0.0001) - lastMessageTimestamp) > 300 ? (new Date()).getDate() + "/" + ((new Date()).getMonth()+1) + "/" + (new Date()).getFullYear() : false,
    time: (((new Date())*0.0001) - lastMessageTimestamp) > 300 ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  });

  $.get(server_url + "/new_message?access_token=" + access_token + "&linkedin_id=" + contact_linkedin_id + "&content=" + messageText).done(function(res) {
    
  }).fail(function(res) {
    myApp.alert("Il semblerait que vous ayez des problèmes de connexion, le message n'a pas été envoyé...", 'Erreur');
  });
}

function loadChatHistory(linkedin_id) {
  lastMessageTimestamp = 0;
  $.get(server_url + "/messages?access_token="+access_token+"&linkedin_id="+linkedin_id).done(function(res) {
    res.messages.forEach(loadChatMessage, res);
    profile = res.contact_user;
    current_user_first_name = res.current_user.first_name;
    current_user_picture_url = res.current_user.picture_url;
    contact_linkedin_id = res.contact_user.linkedin_id;
    stopPreload('chat');
    myApp.scrollMessagesContainer('.messages-content');
    $('.messages-content').show();
    
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
  });
}

function loadLastReceivedMessage(linkedin_id) {
  $.get(server_url + "/last_message?access_token="+access_token+"&linkedin_id="+linkedin_id).done(function(res) {
    message = res.message;
    d = new Date(Number(message.time)*1000);
    myApp.addMessage({
      text: message.content,
      type: 'received',
      avatar: profile.picture_url,
      name: profile.first_name,
      day: (Number(message.time) - lastMessageTimestamp) > 300 ? d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() : false,
      time: (Number(message.time) - lastMessageTimestamp) > 300 ? d.getHours() + ':' + d.getMinutes() : false
    });
    lastMessageTimestamp = Number(message.time);
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
  });
}

function loadChatMessage(message) {
  if (message.sender_id['$oid'] == this.current_user['_id']['$oid']) {
    messageType = 'sent';
    avatar = this.current_user.picture_url;
    name = this.current_user.first_name;
  } else {
    messageType = 'received';
    avatar = this.contact_user.picture_url;
    name = this.contact_user.first_name;
  }
  d = new Date(Number(message.time)*1000);
  myApp.addMessage({
    // Message text
    text: message.content,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: (Number(message.time) - lastMessageTimestamp) > 300 ? d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() : false,
    time: (Number(message.time) - lastMessageTimestamp) > 300 ? d.getHours() + ':' + d.getMinutes() : false
  });
  lastMessageTimestamp = Number(message.time);
}

function loadContacts() {
  startPreload('contacts', 'chargement');
  $.get(server_url + "/matches?access_token="+access_token).done(function(res) {
    $('.contacts').empty();
    res.forEach(loadContact);
    stopPreload('contacts');
    if($('.contacts').children().size() === 0) {
      $('.contacts').append("<div class='content-block no-contacts'>Vous n'avez aucune connexion pour le moment</div>");
    }
  }).fail(function(res) {
    myApp.alert('Il semblerait que vous ayez des problèmes de connexion !', 'Erreur');
  });
}

function loadContact(object, index, array) {
  var rendered = Mustache.render($('#contact_template').html(), object);
  $('.contacts').append(rendered);
}

function initProfile() {
  $('.back-to-chat').attr('href','chat.html?linkedin_id=' + profile.linkedin_id);
  startPreload('profile', 'chargement du profil');
  var rendered = Mustache.render($('#profile_template').html(), profile);
  $('.profile_wrapper .profile').remove();
  $('.profile_wrapper').append(rendered);
  stopPreload('profile');
}
