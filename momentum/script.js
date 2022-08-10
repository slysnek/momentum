const clock = document.querySelector('.clock')
const calendar = document.querySelector('.calendar')

const date = new Date()
const currentTime = date.toLocaleTimeString();
const currentDate = date.toLocaleDateString();

function showTime(){
    const date = new Date()
    const currentTime = date.toLocaleTimeString();
    const currentDate = date.toLocaleDateString();
    clock.textContent = currentTime;
    calendar.textContent = currentDate;

    console.log(date);
    console.log(currentTime);
    setTimeout(showTime, 1000)
}

showTime();