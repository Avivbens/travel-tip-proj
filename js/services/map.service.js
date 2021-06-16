'use strict'
/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCV0HsS3xb7AxL5oWH9U8-smUFLX_v6J94" async></script> */


// const geocoder = new google.maps.Geocoder();
// let address = "Plaza de Bolívar de Bogotá";

// // 3. Obtain coordinates from the API
// geocoder.geocode({ address: address }, (results, status) => {
//     if (status === "OK") {
//         // Display response in the console
//         console.log(results);
//     } else {
//         alert("Geocode error: " + status);
//     }
// });



var gMap;

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLocation
}


function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function getLocation(value) {
    const API_GEO_KEY = `AIzaSyCV0HsS3xb7AxL5oWH9U8-smUFLX_v6J94`

    const words = value.replace(' ', '+')
    const URL = `
    https://maps.googleapis.com/maps/api/geocode/json?address=${words},+CA&key=${API_GEO_KEY}
    `

    return axios.get(URL)
        .then(res => res.data.results[0].geometry.location)
        .catch(err => {
            console.log('Had Issues: ', err);
        })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_MAP_KEY = 'AIzaSyAMclp12v7QqpL_2tVu4S16SDA896NlOnU';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_MAP_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}