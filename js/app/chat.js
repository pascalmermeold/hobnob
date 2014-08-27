
// CHAT
// Handle message

var lastMessageTimestamp = 0;
var current_user_first_name;
var current_user_picture_url;
var contact_linkedin_id;
  
function initChat(linkedin_id) {
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
  $.get(server_url + "/new_message?access_token=" + access_token + "&linkedin_id=" + contact_linkedin_id + "&content=" + messageText).done(function(res) {
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
  }).fail(function(res) {
    alert('error');
  });
}

function loadChatHistory(linkedin_id) {
  lastMessageTimestamp = 0;
  $.get(server_url + "/messages?access_token="+access_token+"&linkedin_id="+linkedin_id).done(function(res) {
    res['messages'].forEach(loadChatMessage, res);
    current_user_first_name = res['current_user']['first_name'];
    current_user_picture_url = res['current_user']['picture_url'];
    contact_linkedin_id = res['contact_user']['linkedin_id'];
  }).fail(function(res) {
    alert('error');
  });
}

function loadChatMessage(message) {
  if (message['sender_id']['$oid'] == this['current_user']['_id']['$oid']) {
    messageType = 'sent';
    avatar = this['current_user']['picture_url'];
    name = this['current_user']['first_name'];
  } else {
    messageType = 'received'
    avatar = this['contact_user']['picture_url'];
    name = this['contact_user']['first_name'];
  }
  d = new Date(Number(message['time'])*1000);
  myApp.addMessage({
    // Message text
    text: message['content'],
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: (Number(message['time']) - lastMessageTimestamp) > 300 ? d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() : false,
    time: (Number(message['time']) - lastMessageTimestamp) > 300 ? d.getHours() + ':' + d.getMinutes() : false
  });
  lastMessageTimestamp = Number(message['time']);
}

function loadContacts() {
  $.get(server_url + "/matches?access_token="+access_token).done(function(res) {
    $('.contacts').empty();
    res.forEach(loadContact);
    if($('.contacts').children().size() == 0) {
      $('.contacts').append("<div class='no-contacts'>Vous n'avez aucune connexion pour le moment</div>");
    }
  }).fail(function(res) {
    alert('error');
  });
}

function loadContact(object, index, array) {
  var rendered = Mustache.render($('#contact_template').html(), object);
  $('.contacts').append(rendered);
}