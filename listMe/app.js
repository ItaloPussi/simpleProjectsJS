//Query selectors

const container = document.querySelector('.list-container')
const list = document.querySelector('.list-items')

const alert = document.querySelector('.alert')
const form = document.querySelector('.list-form')
const itemIpt = document.querySelector('#itemInput')

const submitBtn = document.querySelector('.submit')
const cancelBtn = document.querySelector('.cancel')
const clearBtn = document.querySelector('.clear-btn')

// variables
let editElement;
let editFlag = false;
let editId = "";
let currentId = localStorage.getItem('items') ? Number(localStorage.getItem('currentId'))+1 : 0;


//Event listeners
form.addEventListener('submit', addItem)
cancelBtn.addEventListener('click', resetParams)
clearBtn.addEventListener('click', clearAllItems)

//Create a element by receiving a value and a valid ID
function createElement(textValue, elementDataID,status){
	const element = document.createElement('article')
		element.classList.add('list-item')

		const attr = document.createAttribute('data-id')
		attr.value = elementDataID;
		element.setAttributeNode(attr)

		element.innerHTML = `
			<p class="title ${status ? 'completed' : ''}" onClick=changeStatus(${elementDataID})>${textValue}</p>
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

	const valueIpt = itemIpt.value

	if (valueIpt && !editFlag){
		createElement(valueIpt, currentId)
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
	container.classList.remove('show-container')
	list.innerHTML = ''
	localStorage.clear()
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
}

//Control the data input on LocalStorage
function handleLocalStorage(){
	const items = [...list.children]
	const itemsContent = items.map(item =>{
		return {
			"id":item.getAttribute('data-id'),
			"value": item.children[0].textContent,
			"completed": item.children[0].classList.length>1 ? true : false
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
		createElement(item.value,item.id,item.completed)
	})
}

