const input = document.querySelector("#lbsInput")

const grams = document.querySelector("#gramsOutput")
const kilograms = document.querySelector("#kilogramsOutput")
const ounces = document.querySelector("#ouncesOutput")
const pounds = document.querySelector("#poundsOutput")

let element = pounds

function convert(){
	value = select.value
	if(value=="pounds"){
		grams.textContent = (input.value * 453.592).toFixed(2)
		kilograms.textContent = (input.value / 2.205).toFixed(2)
		ounces.textContent = (input.value * 16).toFixed(2)
	}else if(value == "grams"){
		pounds.textContent = (input.value / 453.592).toFixed(2)
		kilograms.textContent = (input.value / 1000).toFixed(2)
		ounces.textContent = (input.value / 28.35).toFixed(2)
	}else if(value == "kilograms"){
		grams.textContent = (input.value * 1000).toFixed(2)
		pounds.textContent = (input.value * 2.205).toFixed(2)
		ounces.textContent = (input.value * 35.274).toFixed(2)
	}else{
		grams.textContent = (input.value * 28.35).toFixed(2)
		pounds.textContent = (input.value / 16).toFixed(2)
		kilograms.textContent = (input.value / 35.274).toFixed(2)
	}
}
input.addEventListener("input", convert)

const select = document.querySelector("#select")
select.addEventListener("change", function(){
	value = this.value
	element.parentElement.parentElement.classList.remove("d-none")
	element = document.querySelector(`#${value}Output`)
	element.parentElement.parentElement.classList.add("d-none")
	value = value.charAt(0).toUpperCase() + value.slice(1)

	input.placeholder =`Enter ${value}...`
	input.value !== "" && convert()
})