const fact = document.querySelector("#fact")
const factText = document.querySelector("#factText")

const input = document.querySelector("#numberInput")
input.addEventListener("input", (e)=>getFactFetch(e.target.value))

function getFactFetch(number){
    if(number == '') return
    fetch(`http://numbersapi.com/${number}`)
        .then(response => response.text())
        .then(data =>{
            fact.classList.remove("d-none")
            factText.textContent = data
        })
        .catch(err => console.log(err))
}