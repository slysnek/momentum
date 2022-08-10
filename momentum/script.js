const clock = document.querySelector('.clock');
const calendar = document.querySelector('.calendar');
const greeting = document.querySelector('.greeting')
const userName = document.querySelector('.name')

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
function getTimeOfDay(hours){
    if(hours >= 6 && hours < 12){
        return 'Morning'
    } else if(hours >= 12 && hours < 18){
        return 'Afternoon'
    } else if(hours >= 18 && hours < 24){
        return 'Evening'
    } else if(hours >= 0 && hours < 6){
        return 'Night'
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

showTimeandDate();
greetTheUser();
window.addEventListener('beforeunload', setName)
window.addEventListener('load', getName)