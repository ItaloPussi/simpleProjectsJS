const notesList = document.querySelector(".notes-list")

const addItem = document.querySelector(".add-item")
const addItemButton = document.querySelector(".add-item button")
const inputTitle = document.querySelector(".add-item .title")
const textareaContent = document.querySelector(".add-item .content")

function createNote(index=false,title, content, color, coords = false){
	index = index!==false || index===0 ? index : notesList.children.length
	notesList.innerHTML +=`<li class="note-container ${color}" data-index="${index}"><a href="#" class="note"><button type="button" class="delete-btn" onClick="deleteNote(${index})">X</button><h2 class="note-title">${title}</h2><p class="note-content">${content}</p><button class="copy-btn" onClick="copyNote(${index})"><img src="img/copy.png" /></button></a>`
	
	const attbColor = document.createAttribute("data-color")
	attbColor.value = color
	notesList.children[notesList.children.length-1].setAttributeNode(attbColor)

	const attbTop = document.createAttribute("data-top")
	attbTop.value = `${coords ? coords.top : '10px'}`
	notesList.children[notesList.children.length-1].setAttributeNode(attbTop)
	notesList.children[notesList.children.length-1].style.top = `${coords ? coords.top : '10px'}`

	const attbLeft = document.createAttribute("data-left")
	attbLeft.value = `${coords ? coords.left : '200px'}`
	notesList.children[notesList.children.length-1].setAttributeNode(attbLeft)
	notesList.children[notesList.children.length-1].style.left = `${coords ? coords.left : '250px'}`
	addEventsListenersToDrag()
}

function deleteNote(index){
	Array.from(notesList.children).forEach(note=>{
		if(note.dataset.index == index){
			notesList.removeChild(note)
		}
	})
	handleSaveLocalStorage()
}

function copyNote(index){
	Array.from(notesList.children).forEach(note=>{
		if(note.dataset.index == index){
			const aux = document.getElementById("copy-aux")
			aux.value = note.children[0].children[2].innerHTML
			aux.select()
			document.execCommand('copy')

		}
	})
}
function dragEnd(e){
	this.style.top = `${e.pageY-60}px`
	this.style.left = `${e.pageX-180}px`
	this.setAttribute("data-top",`${e.pageY-60}px`)
	this.setAttribute("data-left",`${e.pageX-180}px`)
	handleSaveLocalStorage()
}
function addEventsListenersToDrag(){
	Array.from(notesList.children).forEach(note=>note.addEventListener("dragend", dragEnd))
}


function handleSaveLocalStorage(){
	let notes = [...notesList.children]
	notes = notes.map(note=>{

		return{
			title: note.children[0].children[1].textContent,
			content: note.children[0].children[2].innerHTML,
			color: note.dataset.color,
			coords: {
				top: note.dataset.top,
				left: note.dataset.left
			}
		}
	})
	localStorage.setItem("notes", JSON.stringify(notes))
}


function recoveryLocalStorageData(){
	let notes = JSON.parse(localStorage.getItem("notes"))
	if(notes==null) return
	notes.forEach((note,index)=>{
		createNote(index,note.title, note.content, note.color, note.coords)
	})
	addEventsListenersToDrag()

}

addItemButton.addEventListener("click",(e)=>{
	e.preventDefault()
	let content = textareaContent.value.replace(/\n\r?/g, '<br />')
	let color = document.querySelector('input[name="color"]:checked').id;
	console.log(color)
	createNote(false,inputTitle.value, content, color)
	inputTitle.value = ''
	textareaContent.value = ''
	handleSaveLocalStorage()
})

const inputs = document.querySelectorAll("[name=color]")
inputs.forEach(input => input.addEventListener("change", function(){
	const actived = document.querySelector("label.active")
	actived.classList.remove("active")

	this.parentNode.classList.add("active")
}))

recoveryLocalStorageData()