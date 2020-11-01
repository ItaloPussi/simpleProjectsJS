const tank = document.querySelector('.tank')
const tankFill = document.querySelector(".tank .fill")
const consumed = document.querySelector("#consumed")
const lake = document.querySelector(".lake")
let totalConsumed = localStorage.getItem("waterController") == null ?  0 : JSON.parse(localStorage.getItem("waterController"))[getTodayDateFormated()]
function displayConsumed(){
	consumed.textContent = `${totalConsumed} ML CONSUMED`
}

function fillWater(qtd){
	tankFill.classList.add("now")
	totalConsumed+=qtd

	let percentage = 100 - totalConsumed / 2000 * 100
	percentage = percentage <0 ? 0 : percentage
	tankFill.style.transform = `translateY(${percentage}%)`
	displayConsumed()

	if(totalConsumed>2000){
		let percentage = 100 - ((totalConsumed-2000) / 30)
		percentage = percentage <0 ? 0 : percentage

		lake.style.transform = `translateY(${percentage}%)`
	}else{
		lake.style.transform = `translateY(100%)`
	}

	handleSaveLocalStorage(totalConsumed)
}

function handleSaveLocalStorage(total){
	const day = getTodayDateFormated()
	let data 
	if(localStorage.getItem("waterController") == null){
		data = {[day]:total}
	}else{
		data = JSON.parse(localStorage.getItem("waterController"))
		data = {
			...data,
			[day]: total
		}
	}
	localStorage.setItem("waterController", JSON.stringify(data))
}

function reset(){
	totalConsumed = 0
	fillWater(0)
}

fillWater(0)

// Return or today as string or as a date object
function getTodayDateFormated(returnDataObject){
	const dt = new Date()
	const today = `${dt.getFullYear()}/${(dt.getMonth() + 1)}/${dt.getDate()}`
	return returnDataObject ? new Date(today) : today
}

