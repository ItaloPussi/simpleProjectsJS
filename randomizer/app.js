const itemsContainer = document.querySelector('.items-container')
const formContainer = document.querySelector('.form-container')

const input = document.querySelector('#input')

const anything = document.querySelectorAll('.item') 
const randomButton = document.querySelector('.randomButton')
const resultDiv = document.querySelector('.result')
let items = []

formContainer.addEventListener('submit', addItem)
itemsContainer.addEventListener('click', removeItem)
randomButton.addEventListener('click', randomItem)
function renderItem(item){
	const element = document.createElement('li')
	element.textContent = item.value
	element.classList.add('item')
	element.id+=item.id
	itemsContainer.appendChild(element)

}

function addItem(e){
	e.preventDefault()

	newItem = {
		"value":input.value,
		"id": items.length
	}

	renderItem(newItem)
	items.push(newItem)
	input.value=""
	saveLocalStorage()
}

function removeItem(e){
	const element = document.getElementById(e.target.id)
	element.parentElement.removeChild(element)
	let removeIndex = ''

	items.map((item,index)=>{
		if(item.id == e.target.id){
			removeIndex = index
		}
		return false
	})

	items.splice(removeIndex,1)
	saveLocalStorage()
}
function saveLocalStorage(){
	localStorage.setItem('possibilities', JSON.stringify(items))
}

function recoveryLocalStorageData(){
	items = JSON.parse(localStorage.getItem('possibilities'))
	items = items == null ? [] : items
	
	items.map(item=>{
		renderItem(item)
	})
}

function randomItem(){
	const randomItem = Math.floor(Math.random() * items.length)
	resultDiv.textContent = items[randomItem].value
}

