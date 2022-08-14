import playlist from './playlist.js'

//приветствие с календарем
const clock = document.querySelector('.clock');
const calendar = document.querySelector('.calendar');
const greeting = document.querySelector('.greeting')
const userName = document.querySelector('.name')
//задник
const body = document.querySelector('body')
const leftArrow = document.querySelector('.arrow-left')
const rightArrow = document.querySelector('.arrow-right')
//цитаты
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const shuffle = document.querySelector('.shuffle-button')
//погода
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description')
const city = document.querySelector('.city')
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')
//аудиоплеер
const audioplayer = document.querySelector('.audioplayer')
const playButton = document.querySelector('.start-track')
const trackList = document.querySelector('.track-list')
const previousButton = document.querySelector('.previous');
const nextButton = document.querySelector('.next');

let randomNumber = getNumforBackgroundandQuote()
, randomNumberforQuote = getNumforBackgroundandQuote();

let isPlay = false;
let currentTrack = 0;

//время и календарь
function showTimeandDate(){
    const date = new Date();
    const options = {month: 'long', day:'numeric', weekday: 'long'};
    clock.textContent = date.toLocaleTimeString();
    calendar.textContent = date.toLocaleDateString('ru-RU', options);
    setTimeout(showTimeandDate, 1000)
}
//приветствие
function greetTheUser(){
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours)
    greeting.textContent = `Good ${timeOfDay},`
    setTimeout(greetTheUser, 1000)
}
//получение времени суток в зависимости от часов
function getTimeOfDay(hours){
    if(hours >= 6 && hours < 12){
        return 'morning'
    } else if(hours >= 12 && hours < 18){
        return 'afternoon'
    } else if(hours >= 18 && hours < 24){
        return 'evening'
    } else if(hours >= 0 && hours < 6){
        return 'night'
    }
}
//сохранение имени
function setName(){
    localStorage.setItem('name', userName.value)
}

//установка имени из локал сторэдж
function getName(){
    if(localStorage.getItem('name')){
        userName.value =  localStorage.getItem('name')
    }
}
//слайдер фоновых изображений
function setBackgroundImage(){
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours);
    randomNumber = randomNumber.toString();
    if(randomNumber.length === 1){
        randomNumber = randomNumber.padStart(2, '0')
    }
    //создаем объект картинки и загружаем в бади при полной загрузке
    let image = new Image();
    image.src = `https://raw.githubusercontent.com/slysnek/momentum-backgrounds/main/${timeOfDay}/${randomNumber}.webp`;
    image.addEventListener('load', function () {
        body.style.backgroundImage = `url(${image.src})`;
    })
}
//генератор случайных чисел для изображений и цитат от 1 до 20
function getNumforBackgroundandQuote(){
    return Math.floor(Math.random() * 20) + 1
}

//функции для стрелочек
function getNextSlide(){
    randomNumber++;
    if(randomNumber > 20){
        randomNumber = 1;
    }
    setBackgroundImage();
}
function getPreviousSlide(){
    randomNumber--;
    if(randomNumber < 1){
        randomNumber = 20;
    }
    setBackgroundImage();
}
//получаем асинхронно цитаты из локального файла
async function getQuotes(){
    let text = await fetch('src/quotes.json');
    let quotes = await text.json();
    if(quotes){
        return quotes;
    } else{
        throw "Quotes didn't load"
    };
}
//отображаем цитаты и автора 
async function displayQuotes(){
    let quotes = await getQuotes();
    randomNumberforQuote = getNumforBackgroundandQuote();
    quote.innerHTML = quotes[randomNumberforQuote].text;
    author.innerHTML = quotes[randomNumberforQuote].author + ' ©';
}
//получаем данные о погоде с апишки
async function getWeather(){
    let cityName = await getCity();
    if (cityName == undefined){
        city.value = ""
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=ru&appid=e25dd9614f6f0f39ce1170ade40d041d&units=metric`;
    try{
        let result = await fetch(url);
        let weatherData = await result.json();
        console.log(weatherData.weather[0].id,
        weatherData.weather[0].description,
        weatherData.main.temp,
        weatherData.wind.speed,
        weatherData.main.humidity);
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${weatherData.weather[0].id}`);
        temperature.textContent = `Температура: ${Math.round(weatherData.main.temp)}°C`;
        wind.textContent = `Ветер: ${Math.round(weatherData.wind.speed)} м/с`;
        humidity.textContent = `Влажность: ${weatherData.main.humidity} %`;
        weatherDescription.textContent = weatherData.weather[0].description;
    }
    catch(error){
        if(cityName === undefined){
            await alert("Поле с названием города пусто. Введите название вашего города для отображения погоды.");
        } else{
            await alert("Введите правильное название города!");
        }
    }
}
//сохраняем название города
function setCity(){
    localStorage.setItem('city', city.value)
}
//устанавливаем название города из локал сторэдж
function getCity(){
    if(localStorage.getItem('city')){
        city.value =  localStorage.getItem('city')
        return city.value;
    } else{
        return undefined;
    }
}
//добавление треков в плейлист
function getTracks(){
    playlist.forEach((track) => {
        let li = document.createElement('li')
        let trackName = track.title
        li.textContent = trackName;
        trackList.append(li);
    })
    audioplayer.src = playlist[currentTrack].source;
    let x = audioplayer.duration;
    console.log(x); 
}

//воспроизведение треков
function playAudio(){
    if(isPlay === true){
        audioplayer.pause();
        playButton.classList.remove('pause');
        playButton.classList.add('play');
        currentTrackBackground()
        isPlay = false;
    } else{
        isPlay = true;
        playButton.classList.remove('play');
        playButton.classList.add('pause');
        currentTrackBackground()
        audioplayer.play()
        setTimeout(()=>{
            if(audioplayer.ended){
                nextTrack();
            }
        },Math.floor(audioplayer.duration) + 1000)
    }
}
//переключение треков
function nextTrack(){
    if(isPlay === true){
        currentTrackBackground()
    }
    currentTrack++;
    if(currentTrack > playlist.length - 1){
        currentTrack = 0;
    }
    isPlay = false;
    audioplayer.src = playlist[currentTrack].source;
    playAudio();
}

function previousTrack(){
    if(isPlay === true){
        currentTrackBackground()
    }
    currentTrack--;
    if(currentTrack < 0){
        currentTrack = playlist.length - 1;
    }
    isPlay = false;
    audioplayer.src = playlist[currentTrack].source;
    playAudio();
}
// выделение трека
function currentTrackBackground(){
    for(const track of document.querySelectorAll('li')){
        if (track.textContent.includes(playlist[currentTrack].title)){
            track.classList.toggle('current-track')
        }
    }
}




showTimeandDate();
greetTheUser();
window.addEventListener('beforeunload', setName);
window.addEventListener('load', getName);
window.addEventListener('beforeunload', setCity);
window.addEventListener('load', getCity);
setBackgroundImage();
displayQuotes();
getWeather();
getTracks();

leftArrow.addEventListener('click', getPreviousSlide)
rightArrow.addEventListener('click', getNextSlide)
shuffle.addEventListener('click', displayQuotes)
city.addEventListener('change', setCity)
city.addEventListener('change', getWeather)
playButton.addEventListener('click', playAudio)
previousButton.addEventListener('click', previousTrack)
nextButton.addEventListener('click', nextTrack)
audioplayer.addEventListener('ended', nextTrack)