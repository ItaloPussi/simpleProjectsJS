const timezone = document.querySelector(".location-timezone")
const temperatureDescription = document.querySelector(".temperature-description")
const temperatureDegree = document.querySelector(".temperature-degree")

let celsius;
let fah;
const getLocation = () => {

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const {longitude, latitude} = position.coords
            getTemperature(latitude, longitude)
        })
    }
}

const getTemperature = (lat, long) => {
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`

    fetch(api).then(response => response.json()).then(data => {
        const {temperature, summary, icon} = data.currently
        temperatureDegree.textContent = temperature
        temperatureDescription.textContent = summary
        timezone.textContent = data.timezone
        celsius = (temperature - 32) * (5 / 9)
        fah = temperature
        setIcons(icon, document.querySelector(".icon"))
    })
}

const setIcons = (icon, iconID) =>{
    const skycons = new Skycons({color: "white"})
    const currentIcon = icon.replace(/-/g, "_").toUpperCase()
    skycons.play()
    return skycons.set(iconID, Skycons[currentIcon])
}

// Change temperature to celsius/fah
const changeTemperature = () => {
    if(temperatureSpan.textContent === 'F'){
        temperatureSpan.textContent = 'C'
        temperatureDegree.textContent = celsius.toFixed(2)
    }else{
        temperatureSpan.textContent = 'F'
        temperatureDegree.textContent = fah
    }
}

const temperatureSection = document.querySelector(".degree-section")
const temperatureSpan = temperatureSection.querySelector("span")
temperatureDegree.addEventListener("click", changeTemperature)


window.addEventListener("load", getLocation)