const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

const weekdays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
]

function addZeroToLeft(number){
	return number<10 ? `0${number}` : number
}

function convertTwelveHoursFormat(hour, minutes){
	AmOrPm = hour <=12 ? 'am' : 'pm'
	hour = hour<=12 ? hour : hour-12
	return `${addZeroToLeft(hour)}:${addZeroToLeft(minutes)}${AmOrPm}`

}

const giveaway = document.querySelector('.giveaway')
const deadline = document.querySelector('.deadline')
const items = document.querySelectorAll('.deadline-format h4')

//9days 14hours 9minutes 9seconds after computer time
const noBreakingCountdown = new Date().getTime() + 828550080
console.log(noBreakingCountdown)

let futureDate = new Date(noBreakingCountdown)

const year = futureDate.getFullYear()
const day = weekdays[futureDate.getDay()]
const date = futureDate.getDate()
const month = months[futureDate.getMonth()]

const hours = futureDate.getHours()
const minutes = futureDate.getMinutes()
const formatedHour = convertTwelveHoursFormat(hours, minutes)
giveaway.textContent = `giveaway ends on ${day}, ${date} ${month} ${year}, ${formatedHour}.` 

const futureTime = futureDate.getTime()


function getRemaningTime(){
	const now = new Date().getTime();

	if (futureTime<now){
		return false;
	}
	let t = futureTime - now;

	const daysLeft = Math.floor(t/86400000)
	t = t % 86400000
	const hoursLeft = Math.floor(t/3600000)
	t = t % 3600000
	const minutesLeft = Math.floor(t/60000)
	t = t % 60000
	const secondsLeft = Math.floor(t/1000)

	items[0].textContent = addZeroToLeft(daysLeft)
	items[1].textContent = addZeroToLeft(hoursLeft)
	items[2].textContent = addZeroToLeft(minutesLeft)
	items[3].textContent = addZeroToLeft(secondsLeft)
}

setInterval(()=>getRemaningTime(), 1000)


