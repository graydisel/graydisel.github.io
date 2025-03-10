
const submitElement = document.getElementById('submit');
const accordionElement = [...document.getElementsByClassName('accordion')];


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

    const textRegEx = /^[a-zA-Z\-]+$/;

    if (!textRegEx.test(city)) {
        alert('Invalid city. Please enter a valid city');
    }
    else {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('weather-information').classList.add('hidden');

        const input = city.toUpperCase();
        const linkApi = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&APPID=5d066958a60d315387d9492393935c19`;

        try {
            const data = await fetch(linkApi).then(res => {
                if (!res.ok) {
                    alert('Sorry, no city matched');
                    throw new Error('Sorry, no city matched');

                }
                return res.json();
            });

            document.getElementById('weather-information').classList.remove('hidden');
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
            document.getElementById('temperature').innerHTML = data.main.temp + '&deg;C';
            document.getElementById('city').innerHTML = data.name;
            document.getElementById('pressure').innerHTML = data.main.pressure;
            document.getElementById('humidity').innerHTML = data.main.humidity;
            document.getElementById('wind-speed').innerHTML = data.wind.speed;
            document.getElementById('wind-direction').innerHTML = data.wind.deg + '&deg;';

        } catch (error) {
            console.log(error.message);
        } finally {
            document.getElementById('loading').classList.add('hidden');
        }
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

