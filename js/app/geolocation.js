function geoLocate() {
	navigator.geolocation.getCurrentPosition(randomRequest, geolocationHighAccuracyError, {maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
	console.log('High accuracy geolocation');
}

function geolocationHighAccuracyError(error) {
	navigator.geolocation.getCurrentPosition(randomRequest, geolocationError, {maximumAge: 0, timeout: 10000, enableHighAccuracy: false});
	console.log('Low accuracy geolocation');
}

function geolocationError(error) {
	alert("La géolocalisation ne fonctionne pas sur votre smartphone. Avez-vous bien activé le GPS ou le Wifi ?");
}