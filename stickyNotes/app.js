const notesList = document.querySelector(".notes-list")

const addItem = document.querySelector(".add-item")
const addItemButton = document.querySelector(".add-item button")
const inputTitle = document.querySelector(".add-item .title")
const textareaContent = document.querySelector(".add-item .content")

let isEditing = false
let edit = {}

const bgLabel = document.querySelector(".bgColorLabel")
const bgSelector = document.querySelector("#bgColorSelect")
bgSelector.addEventListener("input", () => {
	changeBgColor(bgSelector.value)
	handleSaveLocalStorage()
})

function changeBgColor(value){
	document.body.style.background = value
	bgLabel.style.background = value
}

function createNote(index=false,title, content, color, coords = false){
	index = index!==false || index===0 ? index : notesList.children.length
	isALink = content.includes("http") || content.includes("www.")

	notesList.innerHTML +=`
		<li class="note-container ${color}" data-index="${index}">
			<a href="#" class="note">
				<button type="button" class="delete-btn" onClick="deleteNote(${index})">X</button>
				<h2 class="note-title">${title}</h2>
				<p class="note-content">${content}</p>
				<button class="copy-btn" onClick="copyNote(${index})">
					<img src="img/copy.png" />
				</button>
				<button type="button" class="link-btn" onClick="window.open('${content}')">
					<img src="img/clip.png" />
				</button>
				<button type="button" class="edit-btn" onClick="editNote('${index}')">
					<img src="img/edit.png" />
				</button>
			</a>
		</li>`
	

	if(!isALink){
		const linkElement = notesList.children[notesList.children.length-1].children[0].querySelector(".link-btn")
		linkElement.remove()
	}
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

	if(isEditing){
		isEditing = false
		edit = {}
		addItemButton.textContent = "ADD NOTE"
	}
}

function deleteNote(index){
	Array.from(notesList.children).forEach(note=>{
		if(note.dataset.index == index){
			notesList.removeChild(note)
		}
	})
	handleSaveLocalStorage()
}

function editNote(index){
	Array.from(notesList.children).forEach(note=>{
		if(note.dataset.index == index){
			isEditing = true
			edit = {
				index: note.dataset.index,
				coords: {
					top: note.dataset.top,
					left: note.dataset.left
				}
			}
			inputTitle.value = note.children[0].children[1].textContent
			textareaContent.value = note.children[0].children[2].innerHTML.replaceAll(/\<br\>/g, '\n')
			addItemButton.textContent = "EDIT NOTE"
			
			let event = new Event("change")
			document.querySelector(`input#${note.dataset.color}`).dispatchEvent(event)
			document.querySelectorAll("input[type=radio]").forEach(input => input.removeAttribute("checked"))
			document.querySelector(`#${note.dataset.color}`).setAttribute("checked", 'checked')
			notesList.removeChild(note)
		}
	})
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

	let bg = bgLabel.backgroundColor === '' ? "#666" : bgLabel.style.backgroundColor
	localStorage.setItem("notesBG", bg)
}


function recoveryLocalStorageData(){
	let notes = JSON.parse(localStorage.getItem("notes"))
	if(notes==null) return
	notes.forEach((note,index)=>{
		createNote(index,note.title, note.content, note.color, note.coords)
	})
	addEventsListenersToDrag()

	let bg = localStorage.getItem("notesBG")
	bg = bg == null ? "#666" : bg
	changeBgColor(bg)

}

addItemButton.addEventListener("click",(e)=>{
	e.preventDefault()
	let content = textareaContent.value.replace(/\n\r?/g, '<br />')
	let color = document.querySelector('input[name="color"]:checked').id;

	if(isEditing){
		createNote(edit.index,inputTitle.value, content, color, edit.coords)

	} else {
		createNote(false,inputTitle.value, content, color)
	}

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