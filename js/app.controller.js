'use strict'
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onPanToMyLocation = onPanToMyLocation
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onEnterLocation = onEnterLocation
window.onRemoveLocation = onRemoveLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            mapService.addListeners(renderMyPlaces)
        })
        .catch(() => console.log('Error: cannot init map'))
}
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
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
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lng, lat) {
    mapService.panTo(+lng, +lat)
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
            console.log('err!!!', err)
        })
}

function onEnterLocation() {
    const locationName = prompt('Enter locationName')
    mapService.searchLocation(locationName)
        .then((res) => {
            mapService.panTo(res.lat, res.lng)
        }).catch((rej) => {
            console.error(rej)
            onPanToMyLocation()
        })
        // mapService.panTo(position.lat, position.lng)
        // mapService.addMarker(position)
        // get position of that location from 
        // pan to that location and make marker
}

function renderMyPlaces() {
    const locations = mapService.getLocations()
    const elContainer = document.querySelector('.my-locations-area')
    const strHTML = locations.map((location, idx) => {
        return `
        <article class="saved-location">
            <p class="name">${location.name}</p>
            <div>
                <button class="location-btn goto-btn" onclick="onPanTo(${location.location.lat}, ${location.location.lng})">🔎</button>
                <button class="location-btn remove-btn" onclick="onRemoveLocation(${idx})">✖</button>
            </div>
        </article>
        
        `
    }).join('')
    elContainer.innerHTML = strHTML
}

function onRemoveLocation(idx) {
    mapService.removeLocation(idx)
    renderMyPlaces()
}
