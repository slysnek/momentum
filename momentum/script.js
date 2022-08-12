const clock = document.querySelector('.clock');
const calendar = document.querySelector('.calendar');
const greeting = document.querySelector('.greeting')
const userName = document.querySelector('.name')
const body = document.querySelector('body')
const leftArrow = document.querySelector('.arrow-left')
const rightArrow = document.querySelector('.arrow-right')
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const shuffle = document.querySelector('.shuffle-button')
let randomNumber = getNumforBackgroundandQuote()
, randomNumberforQuote = getNumforBackgroundandQuote();


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

async function displayQuotes(){
    let quotes = await getQuotes();
    randomNumberforQuote = getNumforBackgroundandQuote();
    quote.innerHTML = quotes[randomNumberforQuote].text;
    author.innerHTML = quotes[randomNumberforQuote].author + ' ©';
}


showTimeandDate();
greetTheUser();
window.addEventListener('beforeunload', setName);
window.addEventListener('load', getName);
setBackgroundImage();
displayQuotes();

leftArrow.addEventListener('click', getPreviousSlide)
rightArrow.addEventListener('click', getNextSlide)
shuffle.addEventListener('click', displayQuotes)