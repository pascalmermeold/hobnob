var client_id = '77mmcb71lyvzps';
var redirect_uri = 'http://0.0.0.0:3000';

var linkedinapi = {
  authorize: function(options) {
    var deferred = $.Deferred();

    var authUrl = 'https://www.linkedin.com/uas/oauth2/authorization?' + $.param({
      client_id: client_id,
      redirect_uri: redirect_uri,
      response_type: 'code',
      state: 'adazd324234Fs1413'
    });

    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

    $(authWindow).on('loadstart', function(e) {
      var url = e.originalEvent.url;

      var code = /\?code=(.+)&state=.+$/.exec(url);
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        authWindow.close();
      }

      
      

      if (code) {
        $.get('http://0.0.0.0:3000/access_token?code='+code[1]).done(function(data) {
          deferred.resolve(data);
        }).fail(function(response) {
          deferred.reject(response.responseJSON);
        });
      } else if (error) {
        deferred.reject({
          error: error
        });
      }
    });

    return deferred.promise();
  }
};