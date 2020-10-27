const notesList = document.querySelector(".notes-list")

const addItem = document.querySelector(".add-item")
const addItemButton = document.querySelector(".add-item button")
const inputTitle = document.querySelector(".add-item .title")
const textareaContent = document.querySelector(".add-item .content")

function createNote(title, content, coords = false){
	notesList.innerHTML +=`<li class="note-container"><a href="#" class="note"><h2 class="note-title">${title}</h2><p class="note-content">${content}</p></a>`
	
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
			title: note.children[0].children[0].textContent,
			content: note.children[0].children[1].innerHTML,
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
		createNote(note.title, note.content, note.coords)
	})
	addEventsListenersToDrag()

}

addItemButton.addEventListener("click",(e)=>{
	e.preventDefault()
	let content = textareaContent.value.replace(/\n\r?/g, '<br />')
	createNote(inputTitle.value, content)
	inputTitle.value = ''
	textareaContent.value = ''
	handleSaveLocalStorage()
})

