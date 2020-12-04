const time = document.querySelector("#time")
const greeting = document.querySelector("#greeting")
const name = document.querySelector("#name")
const focus = document.querySelector("#focus")

// Show Time
function showTime(){
    let today = new Date()
    let hour = today.getHours()
    let min = today.getMinutes()
    let seconds = today.getSeconds()

    const amPm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12;

    time.innerHTML = `${hour}:${addZeroToLeft(min)}:${addZeroToLeft(seconds)} ${amPm}`

    setTimeout(showTime,1000)
}

function addZeroToLeft(number){
    return (parseInt(number,10) < 10 ? '0' : '') + number
}

function setBgGreet(){
    let today = new Date()
    let hour = today.getHours()

    if(hour < 12){
        // Morning
        document.body.style.backgroundImage = "url('img/morning.jpg')"
        greeting.textContent = "Good Morning"
    }else if (hour < 18){
        // Afternoon
        document.body.style.backgroundImage = "url('img/afternoon.jpg')"
        greeting.textContent = "Good Afternoon"
    }else{
        // Evening
        document.body.style.backgroundImage = "url('img/night.jpg')"
        greeting.textContent = "Good Evening"
        document.body.style.color = 'white'
    }
}

// Get Name
function getName(){
    if(localStorage.getItem("name") === null){
        name.textContent = '[Enter Name]'
    }else{
        name.textContent = localStorage.getItem("name")
    }
}

// Set name 
function setName(e){
    if(e.type === 'keypress'){
        if(!e.which == 13 && e.keyCode != 13) return
    }
    if(name.textContent === '') return
    localStorage.setItem("name", name.textContent)
    name.blur()

}

// Get Focus
function getFocus(){
    if(localStorage.getItem("focus") === null){
        focus.textContent = '[Enter Focus]'
    }else{
        focus.textContent = localStorage.getItem("focus")
    }
}

function setFocus(e){
    if(e.type === 'keypress'){
        if(!e.which == 13 && e.keyCode != 13) return
    }
    if(focus.textContent === '') return
    localStorage.setItem("focus", focus.textContent)
    focus.blur()
}

name.addEventListener('keypress', setName)
name.addEventListener('blur', setName)
focus.addEventListener('keypress', setFocus)
focus.addEventListener('blur', setFocus)

showTime()
setBgGreet()
getName()
getFocus()