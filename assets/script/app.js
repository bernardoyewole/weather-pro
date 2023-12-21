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
const airQuality = select('.air-quality h2');
const sunrise = select('.sunrise');
const sunset = select('.sunset');
const moonrise = select('.moonrise');
const moonset = select('.moonset');
const input = select('input');
const search = select('.search');
const loadingBg = select('.loading-bg');

let lat;
let long;

function getLocation(position) {
    let {latitude, longitude} = position.coords;
    lat = latitude;
    long = longitude;

    getCurrentWeather();

    setInterval(() => {
        loadingBg.style.display = 'none';
    }, 1000);
}

function errorHandler() {
    console.log(`Unable to retrieve your location`);
}

const geoOptions = {
    enableHighAccuracy: true
};

if ('geolocation' in navigator) {
    const geo = navigator.geolocation;
    geo.getCurrentPosition(getLocation, errorHandler, geoOptions);
} else {
    console.log('Geolocation API us not supported by your browser');
}

const weatherOptions = {
    method: 'GET',
}

async function getCurrentWeather() {
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=1d1`
    + `fe10c1ef7468eb9f163809232012&q=${lat},${long}&days=2&aqi=yes&alerts=no`;

    try {
        const response = await fetch(URL, weatherOptions);

        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const weather = await response.json();
        const current = weather.current;
        console.log(current)
        // for moon and sun information
        const forecast = weather.forecast.forecastday[0].astro;

        setWeather(current);
        setMoonAndSun(forecast);
    } catch(error) {
        console.log(error.message);
    }
}

function setWeather(obj) {
    wind.innerText = `${obj.wind_kph}km/h`;
    windDirection.innerText = `${obj.wind_dir}`;
    humidity.innerText = `${obj.humidity}%`;
    feelsLike.innerText = `${obj.feelslike_c}\u00B0C`;
    uvIndex.innerText = `${obj.uv}`;
    pressure.innerText = `${obj.pressure_mb}mb`;
    precipitaion.innerText = `${obj.precip_mm}mm`;
    airQuality.innerText = `${obj.air_quality['us-epa-index']}`;
}

function setMoonAndSun(obj) {
    sunrise.innerText = `${obj.sunrise}`;
    sunset.innerText = `${obj.sunset}`;
    moonrise.innerText = `${obj.moonrise}`;
    moonset.innerText = `${obj.moonset}`;
}

async function getUserWeather(userInput) {
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=1d1`
    + `fe10c1ef7468eb9f163809232012&q=${userInput}&days=2&aqi=yes&alerts=no`;

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

        setWeather(current);
        setMoonAndSun(forecast);
    } catch (error) {
        console.log(error.message);
    }
}

onEvent('click', search, () => {
    getUserWeather(input.value);
});