// Query Selectors
const input = document.querySelector("#listInput")
const listType = document.querySelector("#listType")
const addBtn = document.querySelector("#addBtn")
const lists = document.querySelector(".lists")


function addItem(){
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

function displayLists(listOfLists){
    listOfLists.forEach(({listId, listTitle, listItems}) => {
        const list = document.createElement("div")
        list.classList.add("list")
        list.dataset.id= listId

        const h2 = document.createElement("h2")
        h2.textContent = listTitle

        const ul = document.createElement("ul")
        ul.classList.add("list-inner")

        listItems.forEach(item => {
            const li = document.createElement("li")
            li.textContent = item
            ul.appendChild(li)
        })

        list.appendChild(h2)
        list.appendChild(ul)
        lists.appendChild(list)
    })
    
}

function generateSelectOptions(listOfLists){
    listOfLists.forEach((list)=>{
        const option = document.createElement("option")
        option.value = list.listId
        option.textContent = list.listTitle
        listType.appendChild(option)
    })
}

function handleSaveToLocalStorage(){
    const items = generateItemsListUpdated()
    localStorage.setItem("listsEverywhere@lists", JSON.stringify(items))
}

function handleFetchFromLocalStorage(){
    const items = localStorage.getItem("listsEverywhere@lists") || null
    if(items){
        displayLists(JSON.parse(items))
        generateSelectOptions(JSON.parse(items))
    }
}

handleFetchFromLocalStorage()

addBtn.addEventListener("click", addItem)
lists.addEventListener("click", verifyRemoval)
