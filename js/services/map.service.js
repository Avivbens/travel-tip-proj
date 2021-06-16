'use strict'
var gMap
var gLocations = []
export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchLocation,
    getLocations,
    addListeners,
    removeLocation
}

function addListeners(renderTable) {
    gMap.addListener("click", (mapsMouseEvent) => {
        //get name --> get coords --> push name and coords to the table as a tr wit h go & delete btns
        const locationName = prompt('Enter Location Name:')
        if (!locationName) return
        const gNewPlaceCoords = mapsMouseEvent.latLng.toJSON()
        addMarker(gNewPlaceCoords)
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

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function removeLocation(idx) {
    gLocations.splice(idx, 1)
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function searchLocation(value) {
    const API_GEO_KEY = `AIzaSyCV0HsS3xb7AxL5oWH9U8-smUFLX_v6J94`
    const words = value.replace(' ', '+')
    const URL = `
    https://maps.googleapis.com/maps/api/geocode/json?address=${words},+CA&key=${API_GEO_KEY}
    `
    return axios.get(URL)
        .then(res => res.data.results[0].geometry.location)
        .catch(err => {
            console.log('Had Issues: ', err)
        })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_MAP_KEY = 'AIzaSyAMclp12v7QqpL_2tVu4S16SDA896NlOnU'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_MAP_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)
    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
