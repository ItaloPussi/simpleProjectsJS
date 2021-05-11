const options = document.querySelectorAll(".option")
const optionsWithArgument = document.querySelectorAll(".optionWithArgument")

const textField = document.querySelector("#text-field")

// Handle show if option is active or not
const optionsValues = ["bold", "italic", "underline", "strikeThrough", "justifyLeft", "justifyRight", "justifyCenter", "justifyFull", "insertunorderedlist", "insertorderedlist"]

function verifyIfOptionIsActive(){
    optionsValues.forEach(option => {
        const optionElement = document.querySelector(`[data-command="${option}"]`)
        document.queryCommandState(option) ? optionElement.classList.add("active") : optionElement.classList.remove("active")
    })

    verifyIfOptionValueIsRight()
}

function verifyIfOptionValueIsRight(){
    let fontName = document.queryCommandValue("fontName").toLowerCase()
    document.querySelector("[data-command='fontName']").value = fontName.replace(new RegExp("\"", "g"), "")

    document.querySelector("[data-command='fontSize']").value = document.queryCommandValue("fontSize")
}

// Execute the selected option
function handleOptionClick(e){
    let command = ""
    if(e.target.tagName == "I"){
        command = e.target.parentNode.dataset.command
    } else {
        command = e.target.dataset.command
    }

    document.execCommand(command, false, null)
    textField.focus()
}

function handleOptionInput(e){
    textField.focus()
    command = e.target.dataset.command
    document.execCommand(command, false, e.target.value)

}

options.forEach(option => option.addEventListener("click", handleOptionClick))
optionsWithArgument.forEach(option => option.addEventListener("change", handleOptionInput))
window.addEventListener("click", verifyIfOptionIsActive)
window.addEventListener("keydown", verifyIfOptionIsActive)
textField.focus()
