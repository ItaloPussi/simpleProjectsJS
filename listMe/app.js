//Query selectors

const container = document.querySelector('.list-container')
const list = document.querySelector('.list-items')

const alert = document.querySelector('.alert')
const form = document.querySelector('.list-form')
const itemIpt = document.querySelector('#itemInput')
const radioIpts = document.querySelectorAll("input[name= frequency")

const onlyRadio = document.querySelector("#only")
const typeSelect = document.querySelector("#task-type")

const dynamicBox= document.querySelector("#dynamic")
const dynamicOptions= document.querySelector(".dynamic-options")
const submitBtn = document.querySelector('.submit')
const cancelBtn = document.querySelector('.cancel')
const clearBtn = document.querySelector('.clear-btn')
const resetBtn = document.querySelector('.reset-btn')

// variables
let editElement;
let editFlag = false;
let editId = "";
let currentId = localStorage.getItem('items') ? Number(localStorage.getItem('currentId'))+1 : 0;
let selectedType = ''

//Event listeners
form.addEventListener('submit', addItem)
cancelBtn.addEventListener('click', resetParams)
clearBtn.addEventListener('click', clearAllItems)
resetBtn.addEventListener("click", resetItems)
dynamicBox.addEventListener("change", handleDynamicOptionsDisplay)

typeSelect.addEventListener("change", (e)=>{
	selectedType = e.target.value
	handleDisplayTasksWithSelectedType()
})

function handleDisplayTasksWithSelectedType(){
	const items = [...list.children]
	items.map(item=>{
		if((item.dataset.type != selectedType) && selectedType != ''){
			item.style.display= "none"
		}else{
			item.style.display= "flex"
		}
	})
}
function handleDynamicOptionsDisplay(){
	let toBeDisabled = dynamicBox.checked ? true : false
	dynamicOptions.classList.toggle("hidden")
	radioIpts.forEach(radio=>{
 		radio.disabled = toBeDisabled
 	})
}

function resetItems(){
	const items = [...list.children]
	items.forEach(item=>{
		if(item.getAttribute("data-frequency") == 1 && item.children[0].classList.value.includes("completed")){
			list.removeChild(item)
		}
		if(item.getAttribute("data-frequency") == 2 && item.children[0].classList.value.includes("completed")){
			item.children[0].classList.remove("completed")
		}
		if(item.getAttribute("data-frequency") > 2 && item.getAttribute("data-frequency")!=6){
			const dt = new Date()
			let day = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate()
			day = new Date(day)
			
			if(item.getAttribute("data-frequency") == 3){
				day.setDate(day.getDate() + 7)
			}
			if(item.getAttribute("data-frequency") == 4){
				day.setDate(day.getDate() + 30)
			}
			if(item.getAttribute("data-frequency") == 5){
				day.setDate(day.getDate() + 15)
			}

			if(item.children[0].classList.value.includes("completed")){
				day = day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + day.getDate()
				item.setAttribute("data-frequencyDate", day)
				item.children[0].classList.remove("completed")
				item.style.display = "none"
			}
		}
		if(item.getAttribute("data-frequency") == 6 && item.children[0].classList.value.includes("completed")){
			if(item.getAttribute("data-current") == item.getAttribute("data-max")){
				list.removeChild(item)
				return false
			}
			item.children[0].children[1].textContent = item.children[0].children[1].textContent.replace(item.getAttribute("data-current"), parseInt(item.getAttribute("data-current")) + 1)
			item.setAttribute("data-current",parseInt(item.getAttribute("data-current")) + 1)
			item.children[0].classList.remove("completed")

		}

	})
	handleLocalStorage()
}
//Create a element by receiving a value and a valid ID
function createElement(textValue, elementDataID,status, frequency, frequencyDate, dynamics, taskType){
	const element = document.createElement('article')
		element.classList.add('list-item')

		const attrId = document.createAttribute('data-id')
		attrId.value = elementDataID;
		element.setAttributeNode(attrId)

		const attrFrequency = document.createAttribute("data-frequency")
		attrFrequency.value = frequency
		element.setAttributeNode(attrFrequency)

		const attrType = document.createAttribute("data-type")
		attrType.value = taskType
		element.setAttributeNode(attrType)

		if(frequency > 2 && frequency != 6){
			const dt = new Date()

			if(frequencyDate){
				const frequencyDay = document.createAttribute("data-frequencyDate")
				frequencyDay.value = frequencyDate
				element.setAttributeNode(frequencyDay)
				
				const today =  new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate())
				frequencyDate = new Date(frequencyDate)

				if(frequencyDate > today){
					element.style.display = "none"
				}
			}else{
				const frequencyDay = document.createAttribute("data-frequencyDate")
				frequencyDay.value = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate()
				element.setAttributeNode(frequencyDay)


			}
		}

		if(frequency == 6 && !dynamics){
			const current = document.querySelector("input[name=current]").value
			const max = document.querySelector("input[name=max]").value
				
			textValue = textValue.replace("$", current)
			textValue+=` (${max})`

			const currentAttb = document.createAttribute("data-current")
			currentAttb.value = current
			element.setAttributeNode(currentAttb)

			const maxAttb = document.createAttribute("data-max")
			maxAttb.value = max
			element.setAttributeNode(maxAttb)
	
		}else if(frequency == 6 && dynamics){

			const currentAttb = document.createAttribute("data-current")
			currentAttb.value = dynamics.currentValue
			element.setAttributeNode(currentAttb)

			const maxAttb = document.createAttribute("data-max")
			maxAttb.value = dynamics.maxValue
			element.setAttributeNode(maxAttb)
		}

		element.innerHTML = `
			<p class="title ${status ? 'completed' : ''}" onClick=changeStatus(${elementDataID})>
				<span class="type" data-type="${taskType}" ></span>
				<span class="text">${textValue}</span>
			</p>
			<div class="btn-container">
				<button class="edit-btn" onClick=editItem(${elementDataID})>
					<i class="fas fa-edit"></i>
				</button>

				<button class="delete-btn" onClick=deleteItem(${elementDataID})>
					<i class="fas fa-trash"></i>
				</button>
			</div>
		`
		list.appendChild(element)
		container.classList.add('show-container')

}

//Handle the submit action triggered by the user
function addItem(e){
	e.preventDefault()

	if(selectedType === ""){
		displayAlert("Please select a valid type", "danger")
		return false;
	}

	const selectedFrequency = dynamicBox.checked ? 6 : document.querySelector('input[type = radio]:checked').value

	const valueIpt = itemIpt.value

	if (valueIpt && !editFlag){
		createElement(valueIpt, currentId, false,selectedFrequency, false, false, parseInt(selectedType))
		displayAlert('Item add with success!', 'success')
		resetParams()
		localStorage.setItem('currentId', currentId)
		currentId++

	}else if(valueIpt && editFlag){
		editElement.textContent = valueIpt
		displayAlert('Item edited with success!', 'success')
		resetParams()
	}else{
		displayAlert('Please enter value', 'danger')
	}
	handleLocalStorage()
}

//Change the completed status by click
function changeStatus(clickedId){
	const clickedItem = document.querySelector(`[data-id="${clickedId}"]`).children[0]
	clickedItem.classList.length>1 ? clickedItem.classList.remove("completed") : clickedItem.classList.add("completed")
	handleLocalStorage()
}

//Edit the text of a item
function editItem(targetId){
 	editFlag=true
 	editId=targetId
 	editElement = document.querySelector(`[data-id="${targetId}"]`).children[0]
 	submitBtn.textContent = 'edit'
 	itemIpt.value = editElement.textContent
 	itemIpt.focus()
 	cancelBtn.classList.remove('hidden')
 	dynamicBox.disabled = true
 	radioIpts.forEach(radio=>{
 		radio.disabled = true
 	})
}

//Delete determined item
async function deleteItem(targetId){
	

	const element = document.querySelector(`[data-id="${targetId}"]`)
	list.removeChild(element)
	if(list.children.length == 0){
		container.classList.remove('show-container')
		localStorage.clear()
	}
	displayAlert('Item removed with success', 'success')
	handleLocalStorage()
	resetParams()
}

//Delete all items
 function clearAllItems(){
	let confirm = window.prompt("Digite CONFIRMAR para apagar TUDO")

	if (confirm != "CONFIRMAR") return
	container.classList.remove('show-container')
	list.innerHTML = ''
	localStorage.removeItem("items")
	localStorage.removeItem("currentId")
	resetParams()
	displayAlert('Removed all items', 'success')
	currentId=1
}

//Handle alert interaction with the user
function displayAlert(text, action){
	alert.textContent = text
	alert.classList.add(`alert-${action}`)
	setTimeout(function(){
		alert.classList.remove(`alert-${action}`)
		alert.textContent=''
	},1500)

}

//Reset specific params
function resetParams(){
	itemIpt.value=""
	editFlag = false;
	editId = ""
	submitBtn.textContent = "submit"
	cancelBtn.classList.add('hidden')
	onlyRadio.checked = true
	dynamicBox.checked = false;
	dynamicOptions.classList.add("hidden")
	dynamicBox.disabled = false
	radioIpts.forEach(radio=>{
 		radio.disabled = false
 	})
 	typeSelect.value = ''
 	selectedType = ''
 	handleDisplayTasksWithSelectedType()
}

//Control the data input on LocalStorage
function handleLocalStorage(){
	const items = [...list.children]
	const itemsContent = items.map(item =>{
		dynamics = false;
		if(item.getAttribute("data-frequency")==6){
			dynamics = {
				"currentValue": item.getAttribute("data-current"),
				"maxValue": item.getAttribute("data-max")
			}
		}
		return {
			"id":item.getAttribute('data-id'),
			"value": item.children[0].textContent,
			"completed": item.children[0].classList.length>1 ? true : false,
			"frequency": item.getAttribute("data-frequency"),
			"frequencyDate": item.getAttribute("data-frequencyDate") ? item.getAttribute("data-frequencyDate") : false,
			dynamics,
			"type": item.getAttribute("data-type")
		}
	})
	localStorage.setItem('items',JSON.stringify(itemsContent))
}

//Retrieve the data from localStorage
function recoverLocalStorageData(){
	const items = JSON.parse(localStorage.getItem('items'))
	if(!items){
		return false;
	}
	items.map(item=>{
		createElement(item.value,item.id,item.completed, item.frequency, item.frequencyDate, item.dynamics, item.type)
	})
}

