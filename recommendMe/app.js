// Recomendation Class: Represents a unique recomendation
class Recomendation {
    constructor(title, type, source, note){
        this.title = title
        this.type = type
        this.source = source
        this.note = note
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayRecomendations(){
        const recomendations = Store.getRecomendations()
        recomendations.forEach(recomendation => UI.addRecomendationToList(recomendation))
    }

    static addRecomendationToList(recomendation){
        const list = document.querySelector("#recomendation-list")
        
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${recomendation.title}</td>
            <td>${recomendation.type}</td>
            <td>${recomendation.source}</td>
            <td>${recomendation.note}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static deleteRecomendation(el){
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className){
        const div = document.createElement("div")
        div.className = `alert alert-${className}`
        div.textContent = message
        const container = document.querySelector(".container")
        const form = document.querySelector("#recomendation-form")
        container.insertBefore(div, form)

        setTimeout(() => div.remove(),2000)
    }
}
// Store Class: Handle Storage
class Store{

    static getRecomendations(){
        let recomendations = JSON.parse(localStorage.getItem("recomendations"))
        return recomendations === null ? [] : recomendations
    }

    static addRecomendation(recomendation){
        const recomendations = Store.getRecomendations()
        recomendations.push(recomendation)
        localStorage.setItem('recomendations', JSON.stringify(recomendations))
    }

    static deleteRecomendation(title){
        const recomendations = Store.getRecomendations()

        recomendations.forEach((recomendation, index) =>{
            if(recomendation.title === title){
                recomendations.splice(index,1)
            }
        })

        localStorage.setItem('recomendations', JSON.stringify(recomendations))

    }
}

//Event: Display Recomendations
document.addEventListener("DOMContentLoaded", UI.displayRecomendations)

//Event: Add a recomendation
const form = document.querySelector("#recomendation-form")
form.addEventListener("submit", (e)=>{
    e.preventDefault()

    // Get form values
    const title = document.querySelector("#title").value
    const type = document.querySelector("#type").value
    const source = document.querySelector("#source").value
    const note = document.querySelector("#note").value

    // Validate
    if (title === '' || type === '' || source === '' || note === ''){
        // Error message
        UI.showAlert("Please fill in all fields", "danger")
    }else{
        // Instantiate recomendation
        const recomendation = new Recomendation(title, type, source, note)

        // Add Recomendation to UI
        UI.addRecomendationToList(recomendation)

        // Add Recomendation to localStorage
        Store.addRecomendation(recomendation)

        // Success Message
        UI.showAlert("Recomendation created with success", "success")
        
        // Clear form
        form.reset()
    }
    
})

//Event: Remove a recomendation
document.querySelector("#recomendation-list").addEventListener("click", (e) =>{

    // Remove recomendation from UI
    UI.deleteRecomendation(e.target)

    // Remove recomendation from store
    Store.deleteRecomendation(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling,textContent)

    // Success Message
    UI.showAlert("Recomendation deleted with success", "success")
})