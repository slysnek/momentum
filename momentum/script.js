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
const select = document.querySelector('.select')
const apitext = document.querySelector('.api-text')
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
const search = document.querySelector('.search')
//аудиоплеер
const audioplayer = document.querySelector('.audioplayer')
const playButton = document.querySelector('.start-track')
const trackList = document.querySelector('.track-list')
const currentTrackDisplay =document.querySelector('.current-track-display')
const previousButton = document.querySelector('.previous');
const nextButton = document.querySelector('.next');
const progressBar = document.querySelector('.progress-bar')
const progress = document.querySelector('.progress')
const length = document.querySelector('.length')
const currentTimeDisplay = document.querySelector('.current-time')
const volumeProgressBar = document.querySelector('.volume-progress-bar')
const volumeProgress = document.querySelector('.volume-progress')
const volumeButton = document.querySelector('.volume-button')
//перевод
const eng = document.querySelector('.english');
const rus = document.querySelector('.russian')
//настройки
const settings = {
    blocks: ['.clock','.calendar','.greeting-wrapper',
     '.quote-wrapper', '.weather-wrapper', '.audio-player-wrapper']
}
const settingButtons = document.querySelectorAll('.hide-button')
//рандомы
let randomNumber = getNumforBackgroundandQuote(),
randomNumberforQuote = getNumforBackgroundandQuote();
//аудиоплеер
let isPlay = false;
let currentTrack = 0;
//таймеры функций
let timeTimeout;
let greetTimeout;

//скрытие блоков
function hideBlocks(){
    for(let i = 0; i < settingButtons.length; i++){
        settingButtons[i].addEventListener('click', () => {
            let el = document.querySelector(settings.blocks[i])
            let activeButton = settingButtons[i]
            el.classList.toggle('hidden')
            activeButton.classList.toggle('hide-button-toggle')
            if(activeButton.classList.contains('hide-button-toggle')){
                window.localStorage.setItem(settings.blocks[i], true)
            } else {
                window.localStorage.removeItem(settings.blocks[i])
            }
        })
    }
}
//выбор апи в настройках
function getApiToWorkWith(){
        let option = (select.options[select.selectedIndex].text);
        let optionValue = select.value;
        setApi(option, optionValue);
        setBackgroundImage();
}
//сохраняем апи
function setApi(option, optionValue){
    localStorage.setItem('api', option)
    localStorage.setItem('selVal', optionValue)
}
//загружаем апи
function getApi(){
    let api = "Github"
    let apiValue = 0;
    if(localStorage.getItem('api')){
        api = localStorage.getItem('api')
    }
    if(localStorage.getItem('selVal')){
        apiValue = localStorage.getItem('selVal')
    }
    select.value = apiValue;
    return api;
}
select.addEventListener('change', getApiToWorkWith)
window.addEventListener('load', getApi)
//достаем и применяем настройки (через листенер внизу)
function getSettings(){
    for(let i = 0; i < settings.blocks.length; i++){
        if(localStorage.getItem(settings.blocks[i]) == 'true'){
            document.querySelector(settings.blocks[i]).classList.toggle('hidden')
            settingButtons[i].classList.toggle('hide-button-toggle')
        }
    }
}
//перевод
let language = "rus";

const translation = {
    eng: {
        calendar: "en-En",
        weatherLang: "en",
        weatherOptions: ['Temperature', 'Wind', 'Humidity'],
        weatherError: ["The field with the name of the city is empty. Enter the name of your city to display the weather.", "Enter the correct city name!"],
        prefixToGreeting: "Good ",
        dateOfTime: ["morning", "afternoon", "evening", "night"],
        timeOptions: {month: 'numeric', day:'numeric', weekday: 'long'},
        quotes: "src/quotes(eng).json",
        buttons: ["Clock", "Date", "Greeting", "Quotes", "Weather", "Audioplayer"],
        api: "Choose API for background:",
        tags: "enter tags"
    },
    rus:{
        calendar:"ru-Ru",
        weatherLang: "ru",
        weatherOptions: ['Температура', 'Ветер', 'Влажность'],
        weatherError: ["Поле с названием города пусто. Введите название вашего города для отображения погоды.", "Введите правильное название города!"],
        prefixToGreeting: "",
        dateOfTime: ["Доброе утро", "Добрый день", "Добрый вечер", "Доброй ночи"],
        timeOptions: {month: 'long', day:'numeric', weekday: 'long'},
        quotes: "src/quotes.json",
        buttons: ["Часы", "Дата", "Приветствие", "Цитаты", "Погода", "Плеер"],
        api: "Выберите апи для заднего фона:",
        tags: "введите тэги"
    } 
}

function translateToEng(){
    language = "eng";

    clearTimeout(timeTimeout);
    clearTimeout(greetTimeout)

    getQuotes(language);
    showTimeandDate(language);
    greetTheUser(language);
    getWeather(language);
    displayQuotes();
    city.placeholder = "your city?";
    document.querySelector('.tags').placeholder = translation[language].tags

    for(let i = 0; i < settingButtons.length; i++){
        settingButtons[i].textContent = translation[language].buttons[i]
    }
    apitext.textContent = translation[language].api;
}

function translateToRus(){
    language = "rus";

    clearTimeout(timeTimeout);
    clearTimeout(greetTimeout)

    getQuotes(language);
    showTimeandDate(language);
    greetTheUser(language);
    getWeather(language);
    displayQuotes();
    city.placeholder = "ваш город?"
    document.querySelector('.tags').placeholder = translation[language].tags

    for(let i = 0; i < settingButtons.length; i++){
        settingButtons[i].textContent = translation[language].buttons[i]
    }
    apitext.textContent = translation[language].api;
}
//запоминаем язык
function setLanguage(){
    localStorage.setItem('language', language)
}
//применяем язык при загрузке и переводим кнопки
function getLanguage(){
    language = localStorage.getItem('language')
    for(let i = 0; i < settingButtons.length; i++){
        settingButtons[i].textContent = translation[language].buttons[i]
    }
    apitext.textContent = translation[language].api;
    document.querySelector('.tags').placeholder = translation[language].tags
    
}

//время и календарь
function showTimeandDate(language){
    const date = new Date();
    const options = translation[language].timeOptions;
    clock.textContent = date.toLocaleTimeString();
    calendar.textContent = date.toLocaleDateString(translation[language].calendar, options);
    timeTimeout = setTimeout(showTimeandDate, 1000, language);
}
//приветствие
function greetTheUser(language){
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours, language)
    greeting.textContent = `${translation[language].prefixToGreeting} ${timeOfDay},`
    greetTimeout = setTimeout(greetTheUser, 1000, language)
}
//получение времени суток в зависимости от часов
function getTimeOfDay(hours, language){
    if(hours >= 6 && hours < 12){
        return translation[language].dateOfTime[0]
    } else if(hours >= 12 && hours < 18){
        return translation[language].dateOfTime[1]
    } else if(hours >= 18 && hours < 24){
        return translation[language].dateOfTime[2]
    } else if(hours >= 0 && hours < 6){
        return translation[language].dateOfTime[3]
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
//работа с апи ансплэш
async function getPhotofromUnsplash(timeOfDay, tags="nature"){
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tags}${timeOfDay}&client_id=mwZicQvxtMJy1pFt7ycw5CRtXnwgM0iMVnGrqDuDp18`;
    console.log(url);
    const result = await fetch(url);
    const image = await result.json(timeOfDay);
    return(image.urls.regular);
}
//работа с апи фликр
async function getPhotofromFlickr(timeOfDay, tags="nature"){
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=967b0e577e1c06b79eeb679cb791b1ec&tags=${tags}${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
    console.log(tags);
    console.log(url);
    const result = await fetch(url);
    const image = await result.json();
    return(image.photos.photo[Math.floor(Math.random() * (100 - 90 + 1))+90].url_l);
}
//слайдер фоновых изображений
async function setBackgroundImage(){
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = getTimeOfDay(hours, 'eng');
    randomNumber = randomNumber.toString();
    if(randomNumber.length === 1){
        randomNumber = randomNumber.padStart(2, '0')
    }
    //создаем объект картинки и загружаем в бади при полной загрузке
    const apiImage = getApi();
    let tags = document.querySelector('.tags').value.trim().replace(" ", "&");
    if (tags){
        tags += '&'
    }
    console.log(tags);
    let imageSource = ""
    if(apiImage === "Github"){
        imageSource = `https://raw.githubusercontent.com/slysnek/momentum-backgrounds/main/${timeOfDay}/${randomNumber}.webp`;
    } else if(apiImage === "Unsplash"){
        imageSource = await getPhotofromUnsplash(timeOfDay, tags);
    } else if(apiImage === "Flickr"){
        imageSource = await getPhotofromFlickr(timeOfDay, tags);
    }
    console.log(imageSource);
    let image = new Image();
    image.src = imageSource;
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
async function getQuotes(language){
    let text = await fetch(translation[language].quotes);
    let quotes = await text.json();
    if(quotes){
        return quotes;
    } else{
        throw "Quotes didn't load"
    };
}
//отображаем цитаты и автора 
async function displayQuotes(){
    let quotes = await getQuotes(language);
    randomNumberforQuote = getNumforBackgroundandQuote();
    quote.innerHTML = quotes[randomNumberforQuote].text;
    author.innerHTML = quotes[randomNumberforQuote].author + ' ©';
}
//получаем данные о погоде с апишки
async function getWeather(language){
    let cityName = await getCity();
    if (cityName == undefined){
        city.value = ""
    }
        let lang = translation[language].weatherLang;
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${lang}&appid=e25dd9614f6f0f39ce1170ade40d041d&units=metric`;
    try{
        let result = await fetch(url);
        let weatherData = await result.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${weatherData.weather[0].id}`);
        temperature.textContent = `${translation[language].weatherOptions[0]}: ${Math.round(weatherData.main.temp)}°C`;
        wind.textContent = `${translation[language].weatherOptions[1]}: ${Math.round(weatherData.wind.speed)} м/с`;
        humidity.textContent = `${translation[language].weatherOptions[2]}: ${weatherData.main.humidity} %`;
        weatherDescription.textContent = weatherData.weather[0].description;
    }
    catch(error){
        if(cityName === undefined){
            await alert(translation[language].weatherError[0]);
        } else{
            await alert(translation[language].weatherError[1]);
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
//добавление треков в плейлист (установка начальной громкости)
function getTracks(){
    playlist.forEach((track) => {
        let li = document.createElement('li')
        let trackName = track.title
        li.textContent = trackName;
        trackList.append(li);
    })
    audioplayer.src = playlist[currentTrack].source;
    audioplayer.volume = .5;
}

//показ длительности трека
function getAudioLength(){
    length.textContent = getTimeCode(audioplayer.duration);
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
        currentTrackDisplay.textContent = playlist[currentTrack].title;
    }
}

//обновление времени трека
function updateTrackTime(){
    setInterval(() =>{
        progress.style.width = audioplayer.currentTime / audioplayer.duration * 100 + '%';
        currentTimeDisplay.textContent = getTimeCode(audioplayer.currentTime)
    }, 500)
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
//прогресс бар
progressBar.addEventListener("click", el => {
  const progressBarWidth = window.getComputedStyle(progressBar).width;
  const timeToSeek = el.offsetX / parseInt(progressBarWidth) * audioplayer.duration;
  audioplayer.currentTime = timeToSeek;
  progress.style.width = audioplayer.currentTime / audioplayer.duration * 100 + "%";
}, false);
//получение тайм-кода
function getTimeCode(trackDuration){
    let seconds = Math.floor(trackDuration);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    return `${minutes}:${String(seconds).padStart(2,0)}`
}
//обновление звука
volumeProgressBar.addEventListener("click", el =>{
    const volumeProgressBarWidth = window.getComputedStyle(volumeProgressBar).width;
    const newVolume = el.offsetX / parseInt(volumeProgressBarWidth);
    audioplayer.volume = newVolume;
    volumeProgress.style.width = newVolume * 100 + '%';
})
//мьют звука
volumeButton.addEventListener("click", () => {
    audioplayer.muted = !audioplayer.muted;
    if(audioplayer.muted){
        volumeButton.classList.toggle('off')
    }else{
        volumeButton.classList.toggle('off')
    }
})


getLanguage();

window.addEventListener('beforeunload', setLanguage);
window.addEventListener('beforeunload', setName);
window.addEventListener('beforeunload', setCity);

window.addEventListener('load', getName);
window.addEventListener('load', getCity);



showTimeandDate(language);
greetTheUser(language);
//getPhotofromUnsplash();
//getPhotofromFlickr();
setBackgroundImage();
displayQuotes();
getTracks();
updateTrackTime()
hideBlocks();

leftArrow.addEventListener('click', getPreviousSlide)
rightArrow.addEventListener('click', getNextSlide)
shuffle.addEventListener('click', displayQuotes)
city.addEventListener('change', setCity)
city.addEventListener('change', () => {
    getWeather(language)}
)
search.addEventListener('click', () => {
    getWeather(language)}
)

audioplayer.addEventListener('loadeddata', getAudioLength)
playButton.addEventListener('click', playAudio)
previousButton.addEventListener('click', previousTrack)
nextButton.addEventListener('click', nextTrack)
audioplayer.addEventListener('ended', nextTrack)

window.addEventListener('load', getSettings)

eng.addEventListener('click', translateToEng)
rus.addEventListener('click', translateToRus)

