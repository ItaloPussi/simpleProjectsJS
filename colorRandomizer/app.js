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
const generateColor = () => {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = Math.floor(Math.random() * 256)
    let hex = `#${convertNumberToHex(r)}${convertNumberToHex(g)}${convertNumberToHex(b)}`

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    document.querySelector("#rgb").value =  `rgb(${r}, ${g}, ${b})`
    document.querySelector("#hex").value = hex
}

const generateButton = document.querySelector("#generate")
generateButton.addEventListener("click", generateColor);
