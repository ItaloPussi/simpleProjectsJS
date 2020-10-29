const generatedPassword = document.querySelector(".password-generated")
const lowerCharacters = document.querySelector("#lower")
const upperCharacters = document.querySelector("#upper")
const numberCharacters = document.querySelector("#number")
const specialCharacters = document.querySelector("#special")
const qtdCharacters = document.querySelector("#qtd")

const button = document.querySelector("#generate")
button.addEventListener("click", generatePassword)

const copy = document.querySelector(".copy")
copy.addEventListener("click", copyText)

const characters = "abcdefghijklmnopqrstuvwxyz"
const special = "!@#$%&*?,.-_+/"

function copyText(){
	var dummy = document.createElement("textarea")
	document.body.appendChild(dummy)
	dummy.value = generatedPassword.value
	dummy.select()
	document.execCommand("copy");
	document.body.removeChild(dummy)

}
function generatePassword(){
	password = ''
	low = lowerCharacters.checked
	upp = upperCharacters.checked
	num = numberCharacters.checked
	spe = specialCharacters.checked
	len = qtdCharacters.value
	possibilites = []
	if(low){
		possibilites.push(0)
	}
	if(upp){
		possibilites.push(1)
	}
	if(num){
		possibilites.push(2)
	}
	if(spe){
		possibilites.push(3)
	}

	if(!low && !upp && !num && !spe){
		alert("Selecione pelo menos uma opção para gerar a senha.")
		return false
	}

	for(let i=1; i<=len;i++){
		do{
			opcao = Math.floor(Math.random() * 4)
		}while(!possibilites.includes(opcao))

		switch(opcao){
			case 0:
				password+=characters[Math.floor(Math.random() * characters.length)].toLowerCase()
				break;
			case 1:
				password+=characters[Math.floor(Math.random() * characters.length)].toUpperCase()
				break;
			case 2:
				password+=Math.floor(Math.random() * 10)
				break;
			case 3:
				password+=special[Math.floor(Math.random() * special.length)]
				break;
		}
	}
	
	generatedPassword.value = password

}