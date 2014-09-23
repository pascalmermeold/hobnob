var client_id = '77mmcb71lyvzps';

var linkedinapi = {
  authorize: function(options) {
    var deferred = $.Deferred();

    var authUrl = 'https://www.linkedin.com/uas/oauth2/authorization?' + $.param({
      client_id: client_id,
      redirect_uri: server_url,
      response_type: 'code',
      state: 'adazd324234Fs1413',
      scope: 'r_fullprofile r_emailaddress r_network'
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
        $.get(server_url + '/access_token?code='+code[1]).done(function(data) {
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