//Query selectors

const container = document.querySelector('.list-container')
const list = document.querySelector('.list-items')

const alert = document.querySelector('.alert')
const form = document.querySelector('.list-form')
const itemIpt = document.querySelector('#itemInput')
const radioIpts = document.querySelectorAll("input[name= frequency")

const onlyRadio = document.querySelector("#only")
const typeSelect = document.querySelector("#task-type")
const pickerDate = document.querySelector("#pickDate")

const dynamicBox = document.querySelector("#dynamic")
const dynamicOptions = document.querySelector(".dynamic-options")
const submitBtn = document.querySelector('.submit')
const cancelBtn = document.querySelector('.cancel')
const clearBtn = document.querySelector('.clear-btn')
const resetBtn = document.querySelector('.reset-btn')
const archiveBtn = document.querySelector('.archive-btn')

// Darkmode related
let darkMode = localStorage.getItem("darkmode")
darkMode = darkMode == null ? true : darkMode
darkMode = darkMode == 'false' ? false : true
darkMode = !darkMode
toggleDarkMode()

const darkSwitch = document.querySelector(".toggle-darkmode")
darkSwitch.addEventListener("click", toggleDarkMode)

function toggleDarkMode(){
	darkMode = !darkMode
	localStorage.setItem("darkmode", darkMode)
	if(darkMode){
		document.querySelector("html").classList.add("dark")
		document.querySelector(".moon").classList.remove("hidden")
		document.querySelector(".sun").classList.add("hidden")
	}else {
		document.querySelector("html").classList.remove("dark")
		document.querySelector(".moon").classList.add("hidden")
		document.querySelector(".sun").classList.remove("hidden")
	}
}
// variables
let editElement;
let editElementText;
let editFlag = false;
let editId = "";
let currentId = localStorage.getItem('items') ? Number(localStorage.getItem('currentId')) + 1 : 0;
let selectedType = ''
let showAllTasks = false

//Event listeners
form.addEventListener('submit', addItem)
cancelBtn.addEventListener('click', resetParams)
clearBtn.addEventListener('click', clearAllItems)
resetBtn.addEventListener("click", resetItems)
dynamicBox.addEventListener("change", handleDynamicOptionsDisplay)
archiveBtn.addEventListener("click", handleDisplayAllTasks)

typeSelect.addEventListener("change", (e) => {
	selectedType = e.target.value
	handleDisplayTasksWithSelectedType()
})

pickerDate.min = pickerDate.value = getTodayDateFormated().replaceAll("/", "-")

// Return or today as string or as a date object
function getTodayDateFormated(returnDataObject) {
	const dt = new Date()

	let month = dt.getMonth() + 1
	month = month < 10 ? `0${month}` : month
	let day = dt.getDate()
	day = day < 10 ? `0${day}` : day

	const today = `${dt.getFullYear()}/${month}/${day}`
	return returnDataObject ? new Date(today) : today
}

// Verifiy if today is a weekday
function todayIsWeekday() {
	const weekday = getTodayDateFormated(true).getDay()
	return weekday == 0 || weekday == 6 ? false : true
}

//Date one is greater than date two?
function compareTwoDates(date1, date2) {
	return date1 > date2
}

function handleDisplayAllTasks() {
	showAllTasks = !showAllTasks
	typeSelect.disabled = showAllTasks ? true : false
	archiveBtn.style.transform = showAllTasks ? "rotateZ(10deg)" : "rotateZ(0deg)"

	if (showAllTasks) {
		const items = [...list.children]
		items.map(item => {
			item.style.display = ((item.dataset.type != selectedType) && selectedType != '') ? "none" : "flex"
		})
	}!showAllTasks && handleDisplayTasksWithSelectedType()

}

function handleDisplayTasksWithSelectedType() {
	const items = [...list.children]
	items.map(item => {
		if ((item.dataset.type != selectedType) && selectedType != '') {
			item.style.display = "none"
		}
		else {
			const displayDay = new Date(item.dataset.displayday)
			const frequencyDate = new Date(item.dataset.frequencydate)
			if ((!compareTwoDates(displayDay, getTodayDateFormated(true))) && (!compareTwoDates(frequencyDate, getTodayDateFormated(true)))) {
				if (item.dataset.frequency == 7 && !todayIsWeekday()) {
					return item.style.display = "none"
				}
				else {
					item.style.display = "flex"
				}
			}
			else {
				item.style.display = "none"
			}
		}

	})
}

function handleDynamicOptionsDisplay() {
	let toBeDisabled = dynamicBox.checked ? true : false
	dynamicOptions.classList.toggle("hidden")
	radioIpts.forEach(radio => {
		radio.disabled = toBeDisabled
	})
}

function resetItems() {
	const items = [...list.children]
	items.forEach(item => {
		const itemDataFrequency = item.getAttribute("data-frequency")
		const itemIsCompleted = item.children[0].classList.value.includes("completed")
		item.children[0].classList.remove("completed")

		if (itemDataFrequency == 1 && itemIsCompleted) {
			list.removeChild(item)
		}
		if (itemDataFrequency >= 2 && itemDataFrequency != 6) {
			let day = new Date(item.getAttribute("data-frequencydate"))

			if(itemDataFrequency == 2) {
				day.setDate(day.getDate() + 1)
			}
			if (itemDataFrequency == 3) {
				day.setDate(day.getDate() + 7)
			}
			if (itemDataFrequency == 4) {
				day.setDate(day.getDate() + 30)
			}

			if (itemIsCompleted) {
				day = day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + day.getDate()
				item.setAttribute("data-frequencyDate", day)
				item.style.display = "none"
			}
		}
		if (itemDataFrequency == 6 && itemIsCompleted) {
			if (item.getAttribute("data-current") == item.getAttribute("data-max")) {
				list.removeChild(item)
				return false
			}
			item.children[0].children[1].textContent = item.children[0].children[1].textContent.replace(item.getAttribute("data-current"), parseInt(item.getAttribute("data-current")) + 1)
			item.setAttribute("data-current", parseInt(item.getAttribute("data-current")) + 1)

		}

	})
	handleLocalStorage()
}


function createAttb(element, attbName, attbValue) {
	const attr = document.createAttribute(`${attbName}`)
	attr.value = attbValue
	element.setAttributeNode(attr)
	return element
}

//Create a element by receiving a value and a valid ID
function createElement(textValue, elementDataID, status, frequency, frequencyDate, dynamics, taskType, initialDisplayDay) {
	let element = document.createElement('article')
	element.classList.add('list-item')

	element = createAttb(element, "data-id", elementDataID)
	element = createAttb(element, "data-frequency", frequency)
	element = createAttb(element, "data-type", taskType)


	if (!initialDisplayDay) {
		const date = new Date(pickerDate.value)
		initialDisplayDay = compareTwoDates(getTodayDateFormated(true), date) ? getTodayDateFormated(false) : pickerDate.value
	}

	if (initialDisplayDay) {
		const date = new Date(initialDisplayDay)
		if (compareTwoDates(date, getTodayDateFormated(true))) {
			element.style.display = "none"
		}

		element = createAttb(element, "data-displayDay", initialDisplayDay)
	}


	if (frequency == 7) {
		const today = getTodayDateFormated(true)
		weekday = parseInt(today.getDay())

		if (!todayIsWeekday()) {
			element.style.display = "none"
		}
	}
	if (frequency > 1 && frequency != 6 && frequency != 7) {
		frequencyDayValue = frequencyDate ? frequencyDate : getTodayDateFormated(false)

		element = createAttb(element, "data-frequencyDate", frequencyDayValue)

		if (frequencyDate) {
			const today = getTodayDateFormated(true)
			frequencyDate = new Date(frequencyDate)

			if (compareTwoDates(frequencyDate, today)) {
				element.style.display = "none"
			}
		}
	}

	if (frequency == 6 && !dynamics) {
		const current = document.querySelector("input[name=current]").value
		const max = document.querySelector("input[name=max]").value

		textValue = textValue.replace("$", current)

		element = createAttb(element, "data-current", current)
		element = createAttb(element, "data-max", max)


	}
	else if (frequency == 6 && dynamics) {

		element = createAttb(element, "data-current", dynamics.currentValue)
		element = createAttb(element, "data-max", dynamics.maxValue)

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
function addItem(e) {
	e.preventDefault()

	const selectedFrequency = dynamicBox.checked ? 6 : document.querySelector('input[type = radio]:checked').value

	if (selectedType === "") {
		displayAlert("Please select a valid type", "danger")
		return false;
	}

	const valueIpt = itemIpt.value

	if (valueIpt && !editFlag) {


		createElement(valueIpt, currentId, false, selectedFrequency, false, false, parseInt(selectedType), false)
		displayAlert('Item add with success!', 'success')
		resetParams()
		localStorage.setItem('currentId', currentId)
		currentId++

	}
	else if (valueIpt && editFlag) {
		editElement.setAttribute("data-type", parseInt(selectedType))
		editElement.querySelector(".type").setAttribute("data-type", parseInt(selectedType))
		editElementText.textContent = valueIpt
		displayAlert('Item edited with success!', 'success')
		resetParams()
	}
	else {
		displayAlert('Please enter value', 'danger')
	}
	handleLocalStorage()
}

//Change the completed status by click
function changeStatus(clickedId) {
	const clickedItem = document.querySelector(`[data-id="${clickedId}"]`).children[0]
	clickedItem.classList.length > 1 ? clickedItem.classList.remove("completed") : clickedItem.classList.add("completed")
	handleLocalStorage()
}

//Edit the text of a item
function editItem(targetId) {
	editFlag = true
	editId = targetId
	editElement = document.querySelector(`[data-id="${targetId}"]`)
	editElementText = editElement.querySelector(".text")
	console.log(editElement)
	submitBtn.textContent = 'edit'
	itemIpt.value = editElementText.textContent.trim()
	itemIpt.focus()
	cancelBtn.classList.remove('hidden')
	dynamicBox.disabled = true
	typeSelect.value = editElement.getAttribute("data-type")
	selectedType = editElement.getAttribute("data-type")
	radioIpts.forEach(radio => {
		radio.disabled = true
	})
}

//Delete determined item
async function deleteItem(targetId) {
	const element = document.querySelector(`[data-id="${targetId}"]`)
	list.removeChild(element)
	if (list.children.length == 0) {
		container.classList.remove('show-container')
		localStorage.removeItem("items")
		localStorage.removeItem("currentId")
	}
	displayAlert('Item removed with success', 'success')
	handleLocalStorage()
	resetParams()
}

//Delete all items
function clearAllItems() {
	let confirm = window.prompt("Digite CONFIRMAR para apagar TUDO")

	if (confirm != "CONFIRMAR") return
	container.classList.remove('show-container')
	list.innerHTML = ''
	localStorage.removeItem("items")
	localStorage.removeItem("currentId")
	resetParams()
	displayAlert('Removed all items', 'success')
	currentId = 1
}

//Handle alert interaction with the user
function displayAlert(text, action) {
	alert.textContent = text
	alert.classList.add(`alert-${action}`)
	setTimeout(function () {
		alert.classList.remove(`alert-${action}`)
		alert.textContent = ''
	}, 1500)

}

//Reset specific params
function resetParams() {
	itemIpt.value = ""
	editFlag = false;
	editId = ""
	submitBtn.textContent = "submit"
	cancelBtn.classList.add('hidden')
	onlyRadio.checked = true
	dynamicBox.checked = false;
	dynamicOptions.classList.add("hidden")
	dynamicBox.disabled = false
	radioIpts.forEach(radio => {
		radio.disabled = false
	})
	typeSelect.value = ''
	typeSelect.disabled = false
	selectedType = ''
	handleDisplayTasksWithSelectedType()
}

//Control the data input on LocalStorage
function handleLocalStorage() {
	const items = [...list.children]
	const itemsContent = items.map(item => {
		dynamics = false;
		if (item.getAttribute("data-frequency") == 6) {
			dynamics = {
				"currentValue": item.getAttribute("data-current"),
				"maxValue": item.getAttribute("data-max")
			}
		}
		return {
			"id": item.getAttribute('data-id'),
			"value": item.children[0].textContent.replaceAll("\n", "").replaceAll("\t", ""),
			"completed": item.children[0].classList.length > 1 ? true : false,
			"frequency": item.getAttribute("data-frequency"),
			"frequencyDate": item.getAttribute("data-frequencyDate") ? item.getAttribute("data-frequencyDate") : false,
			dynamics,
			"type": item.getAttribute("data-type"),
			"initialDisplayDay": item.getAttribute("data-displayDay"),
		}
	})
	localStorage.setItem('items', JSON.stringify(itemsContent))
}

//Retrieve the data from localStorage
function recoverLocalStorageData() {
	const items = JSON.parse(localStorage.getItem('items'))
	if (!items) return

	items.map(item => {
		createElement(item.value, item.id, item.completed, item.frequency, item.frequencyDate, item.dynamics, item.type, item.initialDisplayDay)
	})
}

window.load = recoverLocalStorageData()