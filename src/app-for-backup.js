// const themeToggleBtn = document.getElementById('themeToggle');
// const body = document.body;

// themeToggleBtn.addEventListener('click', ()=>{
//     body.style.backgroundColor = 'black';
// })






// main app 
// Define variables
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const locationTexts = document.querySelectorAll('.locationText');
const currentTime = document.getElementById('currentTime');
const weatherConditionImg = document.getElementById("weatherConditionImg");
const currentTemp = document.getElementById("currentTemp");
const apprantTemp = document.getElementById("apprantTemp");
const cardWindData = document.getElementById("cardWindData");
const cardTempData = document.getElementById("cardTempData");
const cardRainData = document.getElementById("cardRainData");
const cardHumidityData = document.getElementById("cardHumidityData");
const preLoaders = document.querySelectorAll('.preloader');

// Show the preloader
function showPreLoaders() {
  preLoaders.forEach(preLoader => {
    preLoader.style.display = "flex";
});
}

// Hide the preloader
function hidePreLoaders() {
  preLoaders.forEach(preLoader => {
    preLoader.style.display = "none";
});
}

// Fetch coordinates and weather data
async function fetchData(city) {
    showPreLoaders(); // Show preloader before data fetching
    try {
        const coordinates = await getCoordinates(city);
        const lat = coordinates.results[0].latitude;
        const lon = coordinates.results[0].longitude;
        
        
        const weather = await getWeatherData(lat, lon);
        

        // const localTime = convertToLocalTime(apiTime, apiTimeZone);
        
        updateWeatherUI(coordinates, weather);
        console.log(coordinates, weather);
        
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Optionally update UI to show an error message
    } finally {
        hidePreLoaders(); // Hide preloader after data fetching
    }
}

// Fetch default city coordinates and weather data on page load
async function loadDefaultCity() {
    await fetchData("Delhi");
}

// Event listener for search button
searchBtn.addEventListener("click", async () => {
  showPreLoaders()
    const city = cityInput.value;
    await fetchData(city);
    cityInput.value = ""; // Reset city input value
    hidePreLoaders()
});

// Function to get coordinates
async function getCoordinates(city) {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    try {
        const coordinatesResponse = await fetch(geoApiUrl);
        const coordinatesData = await coordinatesResponse.json();
        return coordinatesData;
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error; // Re-throw the error to be caught in fetchData
    }
}

// Function to get weather data
async function getWeatherData(lat, lon) {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,visibility,wind_speed_10m,temperature_80m&daily=temperature_2m_max&timeformat=unixtime&timezone=auto`;
    try {
        const weatherDataResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherDataResponse.json();
        return weatherData;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error; // Re-throw the error to be caught in fetchData
    }
}



// Function to update the UI with weather data
function updateWeatherUI(coordinates, weather) {
  // location city, State, Country 
    locationTexts.forEach(locationText =>{
      locationText.innerHTML = `${coordinates.results[0].name}, ${coordinates.results[0].country}`;
    }) ;
    

    // local time 
    const localTime = new Date(weather.current.time * 1000).toLocaleTimeString();
    currentTime.innerText = `${localTime}`;
    

  // current Temperature 
    currentTemp.innerHTML = `${weather.current.temperature_2m}<sup><span class="text-sm">${weather.current_units.temperature_2m}</span></sup>`;


    // Apparenr Temperature 
    apprantTemp.innerHTML = `Feels Like ${weather.current.apparent_temperature} ${weather.current_units.apparent_temperature}`;

    // Wind 
    cardWindData.innerText = `${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}`;
  // Current Temp in cards 
    cardTempData.innerText = `${weather.current.temperature_2m} ${weather.current_units.temperature_2m}`;
// cards - Rain data 
    cardRainData.innerText = `${weather.current.rain} ${weather.current_units.rain}`;

// card humidity data 
    cardHumidityData.innerText = `${weather.current.relative_humidity_2m} ${weather.current_units.relative_humidity_2m}`;

// day , night , clouds, sun with clouds etc 
    if (weather.current.is_day === 1 ){
      weatherConditionImg.src = "./assets/svg/day.svg";
    }else{
      weatherConditionImg.src = "./assets/svg/night.svg";
    }

    // weather condition 
    const code = weather.current.weather_code
    const weatherCode = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime frost",
      51: "Light drizzle",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy",
      80: "Rain showers: Slight",
      81: "Rain showers: Moderate",
      82: "Rain showers: Violent",
    }
    
    weatherDescription.innerText = `${weatherCode[code]}`
}

// Initialize with default city
loadDefaultCity();


