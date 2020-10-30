const box = document.querySelector('.box')
const fill = document.querySelector(".fill")
const consumed = document.querySelector("#consumed")

let totalConsumed = localStorage.getItem("waterQtd") == null ?  0 : parseInt(localStorage.getItem("waterQtd"))
function displayConsumed(){
	consumed.textContent = `${totalConsumed} ML CONSUMED`
}
function fillWater(qtd){
	fill.classList.add("now")
	totalConsumed+=qtd
	let percentage = 100 - totalConsumed / 2000 * 100
	percentage = percentage <0 ? 0 : percentage
	fill.style.transform = `translateY(${percentage}%)`
	displayConsumed()
	localStorage.setItem("waterQtd", totalConsumed)
}

function reset(){
	totalConsumed = 0
	fillWater(0)
}

fillWater(0)

