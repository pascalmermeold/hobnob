function geoLocate(callback) {
  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {timeout: 5000, enableHighAccuracy: true});
}

function geolocationSuccess(position) {
	options.latitude = position.coords.latitude;
	options.longitude = position.coords.longitude;
	options.accuracy = position.coords.accuracy;
	// if(options.hello) {
	// 	initRandom();
	// }
}

function geolocationError(error) {
  alert("La géolocalisation ne fonctionne pas sur votre smartphone. Vous devez activer le GPS et autoriser HobNob à y accéder pour que l'application fonctionne.");
}