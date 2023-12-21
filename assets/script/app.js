'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const currentTemp = select('.current-temp');
const tempInfo = select('.temp-info');
const date = selectAll('.date p');
const city = select('.city');
const today = select('.today');
const tomorrow = select('.tomorrow');
const wind = select('.wind h2');
const windDirection = select('.wind-direction');
const humidity = select('.humidity h2');
const feelsLike = select('.feels-like h2');
const uvIndex = select('.uv-index h2');
const pressure = select('.pressure h2');
const precipitaion = select('.precipitation h2');
const airQuality = select('.air-quality');
const airInfo = select('.air-info');
const sunrise = select('.sunrise');
const sunset = select('.sunset');
const moonrise = select('.moonrise');
const moonset = select('.moonset');

let lat;
let long;

function getLocation(position) {
    let {latitude, longitude, accuracy} = position.coords;
    lat = latitude;
    long = longitude;
}

function errorHandler() {
    console.log(`Unable to retrieve your location`);
}

const geoOptions = {
    enableHighAccuracy: true
};

if ('geolocation' in navigator) {
    const geo = navigator.geolocation;
//    geo.getCurrentPosition(getLocation, errorHandler, geoOptions);
} else {
    console.log('Geolocation API us not supported by your browser');
}

const weatherOptions = {
    method: 'GET',
}

async function getWeather() {
    const URL = 'https://api.weatherapi.com/v1/forecast.json?key=1d1'
    + 'fe10c1ef7468eb9f163809232012&q=Winnipeg&days=2&aqi=yes&alerts=no';

    try {
        const response = await fetch(URL, weatherOptions);

        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const weather = await response.json();
        const current = weather.current;
        // console.log(current)
        // for moon and sun information
        const forecast = weather.forecast.forecastday[0].astro;
    } catch (error) {
        console.log(error.message);
    }
}

getWeather();