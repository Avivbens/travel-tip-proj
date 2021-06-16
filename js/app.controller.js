import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onPanToMyLocation = onPanToMyLocation;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onEnterLocation = onEnterLocation;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lng, lat) {
    mapService.panTo(+lng, +lat);
}

function onPanToMyLocation() {
    var position = {}
    getPosition()
        .then(pos => {
            position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            mapService.panTo(position.lat, position.lng)
            mapService.addMarker(position)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onEnterLocation() {
    const locationName = prompt('Enter locationName');
    mapService.getLocation(locationName)
        .then((res) => {
            mapService.panTo(res.lat, res.lng)
        }).catch((rej) => {
            console.error(rej);
            onPanToMyLocation()
        })

    // mapService.panTo(position.lat, position.lng)
    // mapService.addMarker(position)

    // get position of that location from 
    // pan to that location and make marker
}