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
window.onCopyMyLocation = onCopyMyLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            mapService.addListeners(renderMyPlaces, renderLocationDetails)
        })
        .catch(() => console.log('Error: cannot init map'))
        .then(() => {
            onGotoPositionByUrl()
            renderLocationDetails()
            document.querySelector('.my-map').classList.add('open-map')
        }).catch((err) => {
            console.log(err);
        })
}
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGotoPositionByUrl() {
    const lat = new URLSearchParams(window.location.search).get('lat')
    const lng = new URLSearchParams(window.location.search).get('lng')
    if (!lat || !lng) return
    onPanTo(lat, lng)
    mapService.setMapZoom(17)
}

function onCopyMyLocation() {
    const center = mapService.getCenterCoords()
    const url = window.location.href.split('?')[0] + `?lat=${center.lat}&lng=${center.lng}`
    copyToClipboard(url);
}

function copyToClipboard(txt) {
    navigator.clipboard.writeText(txt);
    alert('Location copied to clipboard')
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

function onPanTo(lat, lng) {
    mapService.panTo(+lat, +lng)
    renderCurrAddress({ lat: +lat, lng: +lng })
}

function onPanToMyLocation() {
    var position = {}
    getPosition()
        .then(pos => {
            position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            mapService.panTo(position.lat, position.lng)
            mapService.addMarker(position)
            renderLocationDetails()
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onEnterLocation() {
    const locationName = prompt('Enter location name')
    if (!locationName) return
    mapService.searchLocation(locationName)
        .then((res) => {
            mapService.panTo(res.lat, res.lng)
            renderLocationDetails()
        }).catch((rej) => {
            console.error(rej)
            onPanToMyLocation()
        })
}

function renderCurrAddress({ lat, lng }) {
    const elAddress = document.querySelector('.current-location')
    mapService.getAddressByCoords(lat, lng).then((res) => {
        elAddress.innerText = res
    })
}

function renderMyPlaces() {
    const locations = mapService.getLocations()
    const elContainer = document.querySelector('.my-locations-area')
    const strHTML = locations.map((location, idx) => {
        return `
        <article class="saved-location">
            <p class="name">${location.name}</p>
            <div>
                <button class="location-btn goto-btn" onclick="onPanTo(${location.location.lat}, ${location.location.lng})">????</button>
                <button class="location-btn remove-btn" onclick="onRemoveLocation(${idx})">???</button>
            </div>
        </article>
        
        `
    }).join('')
    elContainer.innerHTML = strHTML
}

function selectWeatherImg(weather) {
    const sunImgSrc = 'img/sunny.png'
    const cloudImgSrc = 'img/partly_cloudy.png'
    const rainImgSrc = 'img/rain_s_cloudy.png'
        // ------------
    const val = weather.toLowerCase();
    if (val.includes('cloud')) return cloudImgSrc
    else if (val.includes('rain')) return rainImgSrc
    else if (val.includes('sun')) return sunImgSrc
    return sunImgSrc
}

function renderWeather(msg) {
    const temp = Math.round(msg.temp - 273.15);
    const weather = msg.weather
        // -------
    const selectedImg = selectWeatherImg(weather);
    const strHTML = `

    <div class="temp-box">
        <div class="inner-temp-box">
            <h4>${temp}<span>??</span></h4>
            <img src="${selectedImg}" alt="">
        </div>
        <span class="forecast">${weather}</span>
    </div>
    
    `
    document.querySelector('.weather').innerHTML = strHTML
}

function onRemoveLocation(idx) {
    mapService.removeLocation(idx)
    renderMyPlaces()
}

function renderLocationDetails() {
    const coords = mapService.getCenterCoords()
    renderCurrAddress(coords);
    weatherService.getWeather(coords)
        .then(renderWeather)
        .then(() => {
            document.querySelector('.weather').classList.add('open-weather')
            document.querySelector('.my-locations-area').classList.add('open-weather')
        })
}
