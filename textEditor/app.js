const options = document.querySelectorAll(".option")
const optionsWithArgument = document.querySelectorAll(".optionWithArgument")

const textField = document.querySelector("#text-field")
const fontColorLabel = document.querySelector(".fontColorLabel")

// Handle show if option is active or not
const optionsValues = ["bold", "italic", "underline", "strikeThrough", "justifyLeft", "justifyRight", "justifyCenter", "justifyFull", "insertunorderedlist", "insertorderedlist"]

// Util: convert a number to hexdecimal
const convertNumberToHex = (number) => {
    const values = [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"]
    let hex = ''
    let rest = number
    while (rest >= 16){
        hex = `${values[rest % 16]}${hex}`
        rest = Math.floor(rest / 16)

    }
    hex = values[rest] + hex
    if(hex.length== 1){
        hex = `0${hex}`
    }
    return hex

}

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

    const [r, g, b] = document.queryCommandValue("foreColor").replace("rgb(", "").replace(")","").replace(new RegExp(" ", "g"), "").split(",")
    const hex = `#${convertNumberToHex(r)}${convertNumberToHex(g)}${convertNumberToHex(b)}`
    document.querySelector("[data-command='foreColor']").value = hex
    fontColorLabel.style.borderBottomColor = hex

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

    if(command == "foreColor"){
        fontColorLabel.style.borderBottomColor = e.target.value
    }
    document.execCommand(command, false, e.target.value)

}

options.forEach(option => option.addEventListener("click", handleOptionClick))
optionsWithArgument.forEach(option => option.addEventListener("change", handleOptionInput))
window.addEventListener("click", verifyIfOptionIsActive)
window.addEventListener("keydown", verifyIfOptionIsActive)
textField.focus()
