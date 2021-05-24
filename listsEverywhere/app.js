// Query Selectors
const input = document.querySelector("#listInput")
const listType = document.querySelector("#listType")
const addBtn = document.querySelector("#addBtn")
const lists = document.querySelector(".lists")
const addListBtn = document.querySelector(".add-list")
const uploadButton = document.querySelector(".upload-button")

const modalContainer = document.querySelector(".modal-container")
const modalCloseBtn = document.querySelector(".modal-container .close-modal")
const createListBtn = document.querySelector(".modal-container .create-list")
const createListInput = document.querySelector(".modal-container input")

let currentId = 1

function addItem(){
    if(input.value == "") {
        alert("Item cannot be empty!")
        return
    }
    if(listType.value == "") {
        alert("Please, create a list to insert items!")
        return
    }
    const element = document.createElement("li")
    element.textContent = input.value
    document.querySelector(`.list[data-id="${listType.value}"] ul `).appendChild(element)
    input.value = ""
    handleSaveToLocalStorage()
}

function verifyRemoval(e){
    if(e.target.tagName.toLowerCase() == 'li'){
        e.target.remove()
        handleSaveToLocalStorage()
    }
    if(e.target.tagName.toLowerCase() == 'button'){
        e.target.parentNode.remove()
        generateSelectOptions()
        handleSaveToLocalStorage()
    }
}

function generateItemsListUpdated(){
    const lists = document.querySelectorAll(".lists .list")
    const listOfLists = []
    Array.from(lists).forEach(list => {
        const listTitle = list.querySelector("h2").textContent
        const listItems = Array.from(list.querySelectorAll("ul li")).map(item => item.textContent)
        listOfLists.push({
            listId: list.dataset.id,
            listTitle,
            listItems
        })  

    })

    return listOfLists
}

function createListWithoutItems(listId, listTitle){
    const list = document.createElement("div")
    list.classList.add("list")
    list.dataset.id= listId

    const btn = document.createElement("button")
    btn.textContent = "X"

    const h2 = document.createElement("h2")
    h2.textContent = listTitle.toUpperCase()

    list.appendChild(btn)
    list.appendChild(h2)

    return list
}

function displayLists(listOfLists){
    lists.innerHTML = ""
    listOfLists.forEach(({listId, listTitle, listItems}) => {
        const list = createListWithoutItems(listId, listTitle)

        const ul = document.createElement("ul")
        ul.classList.add("list-inner")

        listItems.forEach(item => {
            const li = document.createElement("li")
            li.textContent = item
            ul.appendChild(li)
        })

        list.appendChild(ul)
        lists.appendChild(list)
    })
    
}

function generateSelectOptions(){
    listType.innerHTML = ""
    listOfLists = generateItemsListUpdated()
    listOfLists.forEach((list)=>{
        const option = document.createElement("option")
        option.value = list.listId
        option.textContent = list.listTitle
        listType.appendChild(option)
    })
}

function handleSaveToLocalStorage(firebaseError = false){
    const items = generateItemsListUpdated()
    if(items.length == 0){
        localStorage.removeItem("listsEverywhere@lists")
        localStorage.removeItem("listsEverywhere@timestamp")
        currentId = 1
    }else {
        localStorage.setItem("listsEverywhere@lists", JSON.stringify(items))
        localStorage.setItem("listsEverywhere@timestamp", new Date().getTime())
    }

    if(firebaseError){
        alert("Ohh something is wrong with your firebase connection. Check it! But for now your lists were saved on localStorage.")
    }
}

function handleFetchFromLocalStorage(){
    let items = localStorage.getItem("listsEverywhere@lists") || null
    if(items){
        items = JSON.parse(items)
        displayLists(items)
        generateSelectOptions(items)
        
        currentId = parseInt(items[items.length -1].listId.split("-")[1])+1 || 1
    }
}

function createList(){
    if(createListInput.value == "") {
        alert("Item cannot be empty!")
        return
    }
    const list = createListWithoutItems(`list-${currentId}`, createListInput.value)
    const ul = document.createElement("ul")
    ul.classList.add("list-inner")
    list.appendChild(ul)
    lists.appendChild(list)
    
    createListInput.value = ""
    currentId++
    closeModal()
    generateSelectOptions()
    handleSaveToLocalStorage()
}

function openModal(){
    modalContainer.classList.add("visible")
}

function closeModal(){
    modalContainer.classList.remove("visible")
}

// Control the data to firebase
function handleUploadFirebase(){
    const items = generateItemsListUpdated()
    if(items.length == 0){
        currentId = 1
    }

	var blob = new Blob([JSON.stringify(items)], {type: "application/json"})
	storage.put(blob).then(function(snapshot){
		window.alert("Save with success")
	}).catch(e=> {
        handleSaveToLocalStorage(true)
	})
}

async function verifySync(items){
    firebaseFileMeta= await storage.getMetadata()
    firebaseFileLastUpload = await new Date(firebaseFileMeta.updated)

    localStorageData = await localStorage.getItem("listsEverywhere@timestamp") || false
    if(localStorageData !== false){
        localStorageLastUpload = await new Date(+localStorageData)
        if(localStorageLastUpload > firebaseFileLastUpload){
            handleFetchFromLocalStorage()
            return false
        }
    }

    displayLists(items)
    generateSelectOptions(items)
    currentId = parseInt(items[items.length -1].listId.split("-")[1])+1 || 1
}

//Retrieve the data from localStorage
async function recoverFirebaseData() {
	let items = '';
	storage.getDownloadURL().then(async function(url){
		var xhr = new XMLHttpRequest();
		xhr.onload = async function(event) {
            var json= xhr.response;
            items = JSON.parse(json)
            if (!items) return
            verifySync(items)
		};
        xhr.onerror = function(event) {
            handleFetchFromLocalStorage()
        }
		xhr.open('GET', url);
		xhr.send()
	  }).catch(()=>{
        handleFetchFromLocalStorage()
      })
}

addListBtn.addEventListener("click", openModal)
createListBtn.addEventListener("click", createList)
modalCloseBtn.addEventListener("click", closeModal)
modalContainer.addEventListener("click", (e)=>{
    if(e.target.classList.contains("modal-container")){
        closeModal()
    }
})

addBtn.addEventListener("click", addItem)
lists.addEventListener("click", verifyRemoval)

uploadButton.addEventListener("click", handleUploadFirebase)

window.load = recoverFirebaseData()
