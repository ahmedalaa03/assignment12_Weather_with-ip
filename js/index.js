const key = '2be111da08814018baf32322241012';
document.getElementById('location').addEventListener('input', function () {
    if (document.getElementById('location').value != '') {
        fetchWeatherData(document.getElementById('location').value);
    }
    if (document.getElementById('location').value == '') {
        document.getElementById('error').classList.add('d-none');
    }
});
async function getLocation(days) {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        fetchWeatherData(data.city,days)
}
getLocation()
document.getElementById('numberOfDays').addEventListener('change', function () {
    if(document.getElementById('location').value == ''){
    getLocation(document.getElementById('numberOfDays').value)}
    else{
        fetchWeatherData(document.getElementById('location').value,document.getElementById('numberOfDays').value)
    }
})
async function fetchWeatherData(location,days = 3) {
    const forecastResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=${days}`);

    if (!forecastResponse.ok) {
        document.getElementById('error').classList.remove('d-none');
        document.getElementById('error').innerHTML = 'This location has no information';
    }
    else {
        const weatherData = await forecastResponse.json();
        displayWeatherData(weatherData);
        document.getElementById('error').classList.add('d-none');
    }
}

function displayWeatherData(data) {
    document.getElementById('contry').innerHTML = `${data.location.name}, ${data.location.country}`;
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    data.forecast.forecastday.forEach(day => {
        const formattedDate = dateFormatter.format(new Date(day.date));
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('col-lg-4', 'gy-4');

        forecastCard.innerHTML = `
        <div class="card">
            <div class="card-header d-flex justify-content-between p-2">
                <div>${new Date(day.date).toLocaleString('default', { weekday: 'long' })}</div>
                <div>${formattedDate}</div>
            </div>
            <div class="card-body">
                <h2 class="card-title h1">${day.day.avgtemp_c}°C</h2>
                <p class="card-text">Average Temperature</p>
                <span class="card-title h6">Max: ${day.day.maxtemp_c}°C</span>
                <span class="card-title h6">Min: ${day.day.mintemp_c}°C</span>
                <div class="my-3"><img src="https:${day.day.condition.icon}" alt="Weather Status"><p>${day.day.condition.text}</p></div>
                <div class="d-flex justify-content-between">
                    <div>Rain: ${day.day.daily_chance_of_rain}%</div>
                    <div>Wind: ${day.day.maxwind_kph} km/h</div>
                    <div>Humidity: ${day.day.avghumidity}%</div>
                </div>
            </div>
        </div>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}