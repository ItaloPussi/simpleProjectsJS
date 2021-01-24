const timeElement = document.querySelector(".time")
const dayElement = document.querySelector(".day")

const addZeroToLeft = number => (
    number <10 ? `0${number}` : number
)
const getTime = () => {
    const d = new Date()
    timeElement.textContent = `${addZeroToLeft(d.getHours())}h${addZeroToLeft(d.getMinutes())}:${addZeroToLeft(d.getSeconds())}`
    dayElement.children[d.getDay()].classList.add("today")
}

setInterval(getTime,1000)
