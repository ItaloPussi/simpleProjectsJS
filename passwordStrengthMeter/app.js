const meter= document.querySelector("#strength-meter")
const passwordInput = document.querySelector("#password-input")
const reasonsContainer = document.querySelector("#reasons")

passwordInput.addEventListener("keyup", (e)=>updateStrengthMeter(e.target.value))

function updateStrengthMeter(password){
	weaknesses = calculatePasswordStrength(password)
	reasonsContainer.innerHTML = ''

	let strength = 100
	weaknesses.forEach(weakness=>{
		strength -=weakness.deduction
		const weaknessMessage = document.createElement("div")
		weaknessMessage.textContent = weakness.message
		reasonsContainer.appendChild(weaknessMessage)
	})

	meter.style.setProperty("--strength", strength)
}
function calculatePasswordStrength(password){
	const weaknesses = []
	weaknesses.push(lengthWeakness(password))
	weaknesses.push(characterTypeWeekness(password, /[a-z]/g, "lowercase"))
	weaknesses.push(characterTypeWeekness(password, /[A-Z]/g, "uppercase"))
	weaknesses.push(characterTypeWeekness(password, /[0-9]/g, "numbers"))
	weaknesses.push(characterTypeWeekness(password, /[^0-9a-zA-Z\s]/g, "special characters"))
	weaknesses.push(repeatCharactersWeekness(password))
	console.log(weaknesses)
	return weaknesses
}

function lengthWeakness(password){
	const length = password.length
	let message = ''
	let deduction = 0

	if(length <=4){
		message = "Your password is too short",
		deduction = 40 
	}else if(length <=8){
		message = "Your password length is medium"
		deduction = 20
	}else if(length <=12){
		message = "Your password could be longer"
		deduction = 10
	}else if(length <16){
		message = "Your password length is almost there"
		deduction = 5
	}

	return {
		message,
		deduction
	}
}

function characterTypeWeekness(password, regex, type){
	const matches = password.match(regex) || []

	let message = ''
	let deduction = 0

	if(matches.length === 0){
		message = `Your password has no ${type} characters`
		deduction = 20
	}else if(matches.length <=2){
		message = `Your password could use more ${type} charactes`
		deduction = 5
	}

	return {
		message,
		deduction
	}
	
}

function repeatCharactersWeekness(password){
	const matches = password.match(/(.)\1/g) || []

	if(matches.length > 0){
		return {
			message: "Your password has repeat characters",
			deduction: matches.length * 10
		}
	}else{
		return {
			message: "",
			deduction:0
		}
	}
}

updateStrengthMeter('')