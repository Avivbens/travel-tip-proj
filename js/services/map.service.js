'use strict'
const API_GEO_KEY = `AIzaSyCV0HsS3xb7AxL5oWH9U8-smUFLX_v6J94`
const API_MAP_KEY = 'AIzaSyAMclp12v7QqpL_2tVu4S16SDA896NlOnU'
    // 
var gMap
var gLocations = []
var gMarkers = []

export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchLocation,
    getLocations,
    addListeners,
    removeLocation,
    setMapZoom,
    getCenterCoords,
    getAddressByCoords
}

function addListeners(renderTable, renderLocationDetails) {
    gMap.addListener("click", (mapsMouseEvent) => {
        //get name --> get coords --> push name and coords to the table as a tr wit h go & delete btns
        const locationName = prompt('Enter Location Name:')
        if (!locationName) return
        const gNewPlaceCoords = mapsMouseEvent.latLng.toJSON()
        addMarker(gNewPlaceCoords)
        renderLocationDetails()
        gLocations.push({
            name: locationName,
            location: gNewPlaceCoords
        })
        renderTable();
    })
}

function getLocations() {
    return gLocations
}

function initMap(lat = 31.9273302, lng = 34.7890692) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
        })
}

function setMapZoom(val = 15) {
    gMap.zoom = val
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    gMarkers.push(marker)
    return marker
}

function removeLocation(idx) {
    gLocations.splice(idx, 1)
    gMarkers[idx].setMap(null);
    gMarkers.splice(idx, 1)
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function searchLocation(value) {
    const words = value.replace(' ', '+')
    const URL = `
    https://maps.googleapis.com/maps/api/geocode/json?address=${words}&key=${API_GEO_KEY}
    `
    return axios.get(URL)
        .then(res => res.data.results[0].geometry.location)
        .catch(err => {
            console.log('Had Issues: ', err)
        })
}

function getAddressByCoords(lat, lng) {
    if ((lat > 90 || lat < -90) || (lng < -180 || lng > 180)) return
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_GEO_KEY}`
    return axios.get(URL)
        .then(res => res.data.results[0].formatted_address)
        .catch(err => {
            console.log('Had Issues: ', err)
        })
}

function getCenterCoords() {
    const lat = gMap.getCenter().lat()
    const lng = gMap.getCenter().lng()
    return { lat, lng }
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_MAP_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)
    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
