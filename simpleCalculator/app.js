const buttons = document.querySelectorAll('button')
const display = document.querySelector('.display')
let countMade = false
function addEventListenerToButtons(button, index){
	if(index==16){
		button.addEventListener('click', clearAndReset)
		return true
	} else if (index==15){
		button.addEventListener('click', getResult)
		return true;
	}
	button.addEventListener('click', handleButtonClick)
}

buttons.forEach(addEventListenerToButtons)

function handleButtonClick(e){
	const displayLength = display.value.length
	const blocks = display.value.split(' ')

	if(countMade === true && (!isNaN(e.target.id)  || e.target.id=='dot')){
		display.value = ''
	}
	countMade = false
	if(!isNaN(e.target.id)){
		display.value += e.target.textContent
		return true;
	}

	if(e.target.id=='dot'){
		if(blocks[blocks.length-1].indexOf('.') != -1){
			return true
		}
			
		if(!isNaN(display.value[displayLength-1]) && display.value[displayLength-1] != ' '){
			display.value += e.target.textContent
		}
		return true
	}

	if(isNaN(display.value[displayLength-1])){
		return true
	}

	if (!isNaN(display.value[displayLength-1]) && display.value[displayLength-1] != ' '){
		display.value += ` ${e.target.textContent} `
	}


}

function clearAndReset(){
	display.value= ''
	countMade = false

}

function getResult(){
	if(display.value[display.value.length-1] == ' '){
		return false
	}
	result = eval(display.value)
	if (result === undefined){
		return false
	}
	display.value = result
	countMade = true
}