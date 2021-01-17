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

const convertRGBToCMYK = (r, g, b) => {
    let r_ = r / 255
    let g_ = g / 255
    let b_ = b / 255

    let k = 1 - Math.max(r_, g_, b_)
    let c = (1-r_-k) / (1-k)
    let m  = (1-g_-k) / (1-k)
    let y = (1-b_-k) / (1-k)

    k = k.toFixed(2) * 100
    c = c.toFixed(2) * 100
    m = m.toFixed(2) * 100
    y = y.toFixed(2) * 100

    return `CMYK (${~~c}%, ${~~m}%, ${~~y}%, ${~~k}%)`
}
const generateColor = () => {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = Math.floor(Math.random() * 256)
    let hex = `#${convertNumberToHex(r)}${convertNumberToHex(g)}${convertNumberToHex(b)}`
    let cmyk = convertRGBToCMYK(r, g, b)

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
    document.querySelector("#rgb").value =  `rgb(${r}, ${g}, ${b})`
    document.querySelector("#hex").value = hex
    document.querySelector("#cmyk").value = cmyk
}

const generateButton = document.querySelector("#generate")
generateButton.addEventListener("click", generateColor);
