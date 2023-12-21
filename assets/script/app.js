'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const currentTemp = select('.current-temp');
const weatherImg = select('.weather-img img');
const tempInfo = select('.temp-info');
const dateText = select('.date-text');
const timeText = select('.time-text');
const dayOrNight = select('.day-or-night');
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
let userDate;

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
        const location = weather.location;
        // for moon and sun information
        const forecast = weather.forecast.forecastday[0].astro;

        setWeather(current, location);
        setMoonAndSun(forecast);
    } catch(error) {
        console.log(error.message);
    }
}

function setDate() {
    userDate = new Date();

    let formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(userDate);
    dateText.innerText = `${userDate.toDateString()}`;
    timeText.innerText = `${formattedTime}`;
}

function setDayOrNight() {
    userDate = new Date();

    if (userDate.getHours() >= 6 && userDate.getHours() <= 18) {
        dayOrNight.innerText = `Day`;
    } else {
        dayOrNight.innerText = `Night`;
    }
}

function setWeather(objOne, objTwo) {
    setDate();
    setDayOrNight();
    currentTemp.innerText = `${objOne.temp_c}\u00B0C`;
    tempInfo.innerText = `${objOne.condition.text}`;
    weatherImg.setAttribute('src', objOne.condition.icon.replaceAll('64', '128'));
    city.innerText = `${objTwo.name}, ${objTwo.country}`;
    wind.innerText = `${objOne.wind_kph}km/h`;
    windDirection.innerText = `${objOne.wind_dir}`;
    humidity.innerText = `${objOne.humidity}%`;
    feelsLike.innerText = `${objOne.feelslike_c}\u00B0C`;
    uvIndex.innerText = `${objOne.uv}`;
    pressure.innerText = `${objOne.pressure_mb}mb`;
    precipitaion.innerText = `${objOne.precip_mm}mm`;
    airQuality.innerText = `${objOne.air_quality['us-epa-index']}`;
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
        const location = weather.location;
        // for moon and sun information
        const forecast = weather.forecast.forecastday[0].astro;

        setWeather(current, location);
        setMoonAndSun(forecast);
    } catch (error) {
        console.log(error.message);
    }
}

onEvent('click', search, () => {
    getUserWeather(input.value);
});