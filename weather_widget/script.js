const submitElement = document.getElementById('submit');
const accordionElement = [...document.getElementsByClassName('accordion')];
const weatherInfoElem = document.getElementById('weather-information');
const weatherIcon = document.getElementById('weather-icon');
const weatherTempElem = document.getElementById('temperature');
const cityNameElem = document.getElementById('city');
const pressureElem = document.getElementById('pressure');
const humidityElem = document.getElementById('humidity');
const windSpeedElem = document.getElementById('wind-speed');
const windDirectionElem = document.getElementById('wind-direction');


submitElement.addEventListener('click', () => {
    const inputCity = document.getElementById('city-name').value;
    getWeatherData(inputCity);
});

accordionElement.forEach((element) => {
    element.addEventListener('click', (event) => {
        accordion(event);
    })
})


async function getWeatherData(city) {

    const textRegEx = /^[a-zA-Z]+([ -][a-zA-Z]+)*$/;

    if (!textRegEx.test(city)) {
        alert('Invalid city. Please enter a valid city');
        return;
    }

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('weather-information').classList.add('hidden');

    const input = city.toUpperCase().replace(' ', '%20');
    const linkApi = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&APPID=5d066958a60d315387d9492393935c19`;

    try {
        const data = await fetch(linkApi).then(res => {
            if (!res.ok) {
                alert('Sorry, no city matched');
                throw new Error('Sorry, no city matched');

            }
            return res.json();
        });

        weatherInfoElem.classList.remove('hidden');
        weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        weatherTempElem.innerHTML = data.main.temp + '&deg;C';
        cityNameElem.innerHTML = data.name;
        pressureElem.innerHTML = data.main.pressure;
        humidityElem.innerHTML = data.main.humidity;
        windSpeedElem.innerHTML = data.wind.speed;
        windDirectionElem.innerHTML = data.wind.deg + '&deg;';

    } catch (error) {
        console.log(error.message);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }


}

function accordion(element) {
    element.target.classList.toggle('active');

    const panelElement = element.target.nextElementSibling;
    if (panelElement.style.maxHeight) {
        panelElement.style.maxHeight = null;
    } else {
        panelElement.style.maxHeight = panelElement.scrollHeight + "px";
    }
}