'use strict'
export const weatherService = {
    getWeather
}
const WEATHER_API_KEY = `5fb38ee3764d076173b9424e965cf19b`;

function getWeather(coords) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${WEATHER_API_KEY}`
    return axios.get(URL)
        .then(res => {
            // console.log('temp is: ', res.data.main.temp, 'weather is:', res.data.weather[0].description) //later will return the msg for weather
            // console.log('res.data :>> ', res.data);
            // const str = `temp is: ${res.data.main.temp},'weather is:', ${res.data.weather[0].description} `
            return {
                temp: res.data.main.temp,
                weather: res.data.weather[0].description
            }
        })
        .catch(err => {
            console.log('Had Issues: ', err)
        })
}
