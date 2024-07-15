const apiKey = 'b2704ead6b96bc0c2d0096d8d6b56bfb'; // Replace with your actual API key

document.getElementById('search-button').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    if (cityName) {
        fetchWeatherData(cityName);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
});

function fetchWeatherData(cityName) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    
    
    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getForecast(lat, lon, cityName);
            } else {
                alert('City not found');
            }
        });
}

function getForecast(lat, lon, cityName) {
    // Added &units=metric to request temperature in Celsius
     const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=b2704ead6b96bc0c2d0096d8d6b56bfb`;
    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data, cityName);
            displayForecast(data);
            updateSearchHistory(cityName);
        });
}

function displayCurrentWeather(data, cityName) {
    const currentWeather = data.list[0];
    const currentWeatherHtml = `
        <h2>${cityName} (${new Date(currentWeather.dt * 1000).toLocaleDateString()})</h2>
        <img src="https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" class="weather-icon" alt="Weather Icon">
        <p>Temp: ${currentWeather.main.temp}°C</p> <!-- Updated to °C -->
        <p>Wind: ${currentWeather.wind.speed} MPH</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
    `;
    document.getElementById('current-weather').innerHTML = currentWeatherHtml;
}

function displayForecast(data) {
    let forecastHtml = '<h2>5-Day Forecast:</h2>';
    const forecastDays = data.list.filter((item, index) => index % 8 === 0);
    
    forecastDays.forEach((day) => {
        forecastHtml += `
            <div class="forecast-day">
                <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" class="weather-icon" alt="Weather Icon">
                <p>Temp: ${day.main.temp}°C</p> <!-- Updated to °C -->
                <p>Wind: ${day.wind.speed} MPH</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    });
    document.getElementById('forecast').innerHTML = forecastHtml;
}

function updateSearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    loadSearchHistory();
}

function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryHtml = searchHistory.map(city => `<button onclick="fetchWeatherData('${city}')">${city}</button>`).join('');
    document.getElementById('search-history').innerHTML = searchHistoryHtml;
}
