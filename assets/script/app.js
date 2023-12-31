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
const feelsHeading = select('.feels-like :first-child');
const uvIndex = select('.uv-index h2');
const pressure = select('.pressure h2');
const pressureHeading = select('.pressure :first-child');
const precipitaion = select('.precipitation h2');
const airQuality = select('.air-quality h2');
const sunrise = select('.sunrise');
const sunset = select('.sunset');
const moonrise = select('.moonrise');
const moonset = select('.moonset');
const input = select('input');
const search = select('.search');
const loadingBg = select('.loading-bg');
const loading = select('.loading');
const feedback = select('.feedback');
const modal = document.getElementById("myModal");

let lat;
let long;
let userDate;
let savedInput;

function getLocation(position) {
    let { latitude, longitude } = position.coords;
    lat = latitude;
    long = longitude;

    getCurrentWeather();
    setTodayStyle();
    removeOverlay();
    feedback.innerText = '';
}

function removeOverlay() {
    loading.style.animationPlayState = 'paused';;
    setTimeout(() => {
        loadingBg.style.display = 'none';
    }, 1000);
}

function displayModal() {
    setTimeout(() => {
        modal.style.display = 'block';
    }, 2000);

    setTimeout(() => {
        modal.style.display = 'none';
    }, 5000);
}

function errorHandler() {
    // set Winnipeg, Manitoba as default location
    lat = 49.895077;
    long = -97.138451;

    getCurrentWeather();
    setTodayStyle();
    removeOverlay();
    displayModal();
}

const geoOptions = {
    enableHighAccuracy: true
};

if ('geolocation' in navigator) {
    const geo = navigator.geolocation;
    geo.getCurrentPosition(getLocation, errorHandler, geoOptions);
} else {
    feedback.innerText = `Geolocation API is not supported by your browser`;
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
        const astro = weather.forecast.forecastday[0].astro;

        setWeather(current, location);
        setMoonAndSun(astro);
    } catch (error) {
        error.message == 400 ? feedback.innerText = `No matching location found` : '';
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
    savedInput = `${objTwo.name}`;
    wind.innerText = `${objOne.wind_kph}km/h`;
    windDirection.innerText = `${objOne.wind_dir}`;
    humidity.innerText = `${objOne.humidity}%`;
    feelsLike.innerText = `${objOne.feelslike_c}\u00B0C`;
    uvIndex.innerText = `${objOne.uv}`;
    pressure.innerText = `${objOne.pressure_mb}mb`;
    precipitaion.innerText = `${objOne.precip_mm}mm`;
    airQuality.innerText = `${objOne.air_quality['us-epa-index']}`;
    feelsHeading.innerText = `Feels Like`;
    pressureHeading.innerText = `Pressure`;
    feedback.innerText = '';
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
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const weather = await response.json();
        const current = weather.current;
        const location = weather.location;
        // for moon and sun information
        const astroCurrent = weather.forecast.forecastday[0].astro;

        setWeather(current, location);
        setMoonAndSun(astroCurrent);
    } catch (error) {
        error.message == 400 ? feedback.innerText = `No matching location found` : '';
        savedInput = city.innerText;
    }
}

onEvent('click', search, () => {
    savedInput = input.value.trim();
    getUserWeather(savedInput);
    input.blur();
    setTodayStyle();
});

onEvent('keypress', input, function (event) {
    if (event.key === "Enter") {
        savedInput = input.value.trim();
        event.preventDefault();
        search.click();
        input.blur();
        setTodayStyle();
    }
});

async function forecastWeather(userInput) {
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=1d1`
        + `fe10c1ef7468eb9f163809232012&q=${userInput}&days=2&aqi=yes&alerts=no`;

    try {
        const response = await fetch(URL, weatherOptions);

        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const weather = await response.json();
        // for tomorrow information
        const forecast = weather.forecast.forecastday[1].day;
        // for moon and sun information
        const astroTomorrow = weather.forecast.forecastday[1].astro;

        setTomorrowWeather(forecast);
        setMoonAndSun(astroTomorrow);
        savedInput = city.innerText;
    } catch (error) {
        error.message == 400 ? feedback.innerText = `No matching location found` : '';
    }
}

function setTomorrrowStyle() {
    today.classList.remove('current-day');
    today.classList.add('other');
    tomorrow.classList.add('current-day');
    tomorrow.classList.remove('other');
}

function setTodayStyle() {
    tomorrow.classList.remove('current-day');
    tomorrow.classList.add('other');
    today.classList.add('current-day');
    today.classList.remove('other');
}

function setTomorrowDate(obj) {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    dateText.innerText = `${tomorrow.toDateString()}`;
    timeText.innerText = `Min Temp: ${obj.mintemp_c}\u00B0C`;
    dayOrNight.innerText = `Max Temp: ${obj.maxtemp_c}\u00B0C`;
}

function setTomorrowWeather(obj) {
    setTomorrowDate(obj);
    currentTemp.innerText = `${obj.avgtemp_c}\u00B0C`;
    tempInfo.innerText = `${obj.condition.text}`;
    weatherImg.setAttribute('src', obj.condition.icon.replaceAll('64', '128'));
    wind.innerText = `${obj.maxwind_kph}km/h`;
    windDirection.innerText = ``;
    humidity.innerText = `${obj.avghumidity}%`;
    feelsHeading.innerText = `Visibility`;
    feelsLike.innerText = `${obj.avgvis_km}km`;
    uvIndex.innerText = `${obj.uv}`;
    pressureHeading.innerText = `Chance of Rain`;
    pressure.innerText = `${obj.daily_chance_of_rain}%`;
    precipitaion.innerText = `${obj.totalprecip_mm}mm`;
    airQuality.innerText = `${obj.air_quality['us-epa-index']}`;
    feedback.innerText = '';
}

onEvent('click', tomorrow, () => {
    setTomorrrowStyle();
    forecastWeather(savedInput);
});

onEvent('click', today, () => {
    setTodayStyle();
    getUserWeather(savedInput);
});

onEvent('click', window, (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});