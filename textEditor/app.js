const options = document.querySelectorAll(".option")
const textField = document.querySelector("#text-field")

// Handle show if option is active or not
const optionsValues = ["bold", "italic", "underline", "strikeThrough", "justifyLeft", "justifyRight", "justifyCenter", "justifyFull", "insertunorderedlist", "insertorderedlist"]

function verifyIfOptionIsActive(){
    optionsValues.forEach(option => {
        const optionElement = document.querySelector(`[data-command="${option}"]`)
        document.queryCommandState(option) ? optionElement.classList.add("active") : optionElement.classList.remove("active")
    })
}

// Execute the selected option
function handleOptionClick(e){
    let command = ""
    if(e.target.tagName == "I"){
        command = e.target.parentNode.dataset.command
    } else {
        command = e.target.dataset.command
    }

    document.execCommand(command, null)
    textField.focus()
}

options.forEach(option => option.addEventListener("click", handleOptionClick))
window.addEventListener("click", verifyIfOptionIsActive)
window.addEventListener("keydown", verifyIfOptionIsActive)
textField.focus()
