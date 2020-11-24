const factYear = document.querySelector("#factYear")
const factTextYear = document.querySelector("#factTextYear")

const inputYear = document.querySelector("#yearInput")
inputYear.addEventListener("input", (e)=>getFactYearAjax(e.target.value))

function getFactYearAjax(year){
    if(year == '') return
    if(year.length != 4){
        factYear.classList.add("d-none")
        return
    }
    let xhr = new XMLHttpRequest()
    xhr.open('get', `http://numbersapi.com/${year}/year`)
    xhr.onload = function(){
        if(this.status != 200) return
        factYear.classList.remove("d-none")
        factTextYear.textContent = this.responseText
    }

    xhr.send()
}
// --------------------------------------------------------------------
const factDate = document.querySelector("#factDate")
const factTextDate = document.querySelector("#factTextDate")

const inputDay = document.querySelector("#dayInput")
const inputMonth = document.querySelector("#monthInput")
inputDay.addEventListener("input", getFactDateAjax)
inputMonth.addEventListener("input", getFactDateAjax)

function getFactDateAjax(){
    let day = inputDay.value
    let month = inputMonth.value
    if(day.length != 2 || month.length != 2){
        factDate.classList.add("d-none")
        return
    }
    let xhr = new XMLHttpRequest()
    xhr.open('get', `http://numbersapi.com/${month}/${day}/date`)
    xhr.onload = function(){
        if(this.status != 200) return
        factDate.classList.remove("d-none")
        factTextDate.textContent = this.responseText
    }

    xhr.send()
}