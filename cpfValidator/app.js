const input = document.querySelector('#cpf')
const btn = document.querySelector('.validate')
const result = document.querySelector('.result')
btn.addEventListener('click', validateCPF)

function invalidCpf(){
	result.textContent = 'O CPF informado é inválido!'
	result.classList.add('red')
	result.classList.remove('green')
}

function validCpf(){
	result.textContent = 'O CPF informado é válido!'
	result.classList.remove('red')
	result.classList.add('green')
}
function validateCPF(){
	let accEightFirstDigits = 0
	let accNineFirstDigits = 0
	const unformatedCpf = input.value
	const formatedCpf = unformatedCpf.replace(/\D/g,'');
	const splitedCpf = formatedCpf.split("")
	const reversedCpf = splitedCpf.reverse().join("")


	if(formatedCpf.length == 0){
		result.textContent = ''
		return false
	}
	if(formatedCpf.length != 11){
		invalidCpf()
		return false
	}

	//VERIFICATE IF ALL DIGITS ARE THE SAME
	var splitedCpfWithoutDuplicates = splitedCpf.filter((digit, i) => splitedCpf.indexOf(digit) === i);
	if(splitedCpfWithoutDuplicates.length == 1){
		invalidCpf()
		return false
	}

	//FIRST VERIFICATOR DIGIT VERIFICATION
		for(let i = 10; i>=2;i--){
			accEightFirstDigits+= reversedCpf[i] * i
		}

		accEightFirstDigits*=10
		let firstVerificatorDigit = accEightFirstDigits % 11
		firstVerificatorDigit = firstVerificatorDigit == 10 ? 0 : firstVerificatorDigit

		if(formatedCpf[9] != firstVerificatorDigit){
			invalidCpf()
			return false
		}

	//SECOND VERIFICATOR DIGIT VERIFICATION
		for(let i = 11; i>=2;i--){
			accNineFirstDigits+= reversedCpf[i-1] * i
		}

		accNineFirstDigits*=10
		let secondVerificatorDigit = accNineFirstDigits % 11
		secondVerificatorDigit = secondVerificatorDigit == 10 ? 0 : secondVerificatorDigit

		if(formatedCpf[10] != secondVerificatorDigit){
			invalidCpf()
			return false
		}

	validCpf()
}
