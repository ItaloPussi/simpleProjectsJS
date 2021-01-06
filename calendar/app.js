const months = [
    "January",
    "February",
    "March",
    "April",
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const date = new Date()

const renderCalendar = function(){
    date.setDate(1)

    const firstDayIndex = date.getDay()
    const lastDayIndex =new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay()

    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate()

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

    const monthElement = document.querySelector(".date h1")
    monthElement.textContent = months[date.getMonth()]

    const todayTextElement = document.querySelector(".date p")
    todayTextElement.textContent = new Date().toDateString()

    const monthDays = document.querySelector(".days")
    let days = ""


    for (let x = firstDayIndex; x>0; x--){
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`
    }

    for(let i = 1; i<= lastDay; i++){
        if(i === new Date().getDate() && date.getMonth() === new Date().getMonth()){
            days+= `<div class="today">${i}</div>`
        }else {
            days+= `<div>${i}</div>`
        }
    }

    maxNextDay = 6 - lastDayIndex
    for(let n = 1; n<=maxNextDay; n++){
        days+= `<div class="next-date">${n}</div>`
    }
    monthDays.innerHTML = days
}

renderCalendar()

document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() -1)
    renderCalendar()
})

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() +1)
    renderCalendar()
})