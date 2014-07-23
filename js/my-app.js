// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Framework7.$;

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});
var homeView = myApp.addView('.view-home', {
    dynamicNavbar: true
});
var optionsView = myApp.addView('.view-settings', {
    dynamicNavbar: true
});
var contactsView = myApp.addView('.view-contact', {
    dynamicNavbar: true
});
var chatView = myApp.addView('.view-chat', {
    dynamicNavbar: true
});

// CHAT
// Handle message
$$('.messagebar .toolbar-inner .link').on('click', function () {
  var textarea = $$('.messagebar textarea');
  // Message text
  var messageText = textarea.val().trim();
  // Exit if empy message
  if (messageText.length === 0) return;

  // Empty textarea
  textarea.val('').trigger('change');

  // Random message type
  var messageType = (['sent', 'received'])[Math.round(Math.random())];

  // Avatar and name for received message
  var avatar, name;
  if(messageType === 'received') {
    avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
    name = 'Kate';
  }
  // Add message
  myApp.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  });

  // Update conversation flag
  conversationStarted = false;
});
