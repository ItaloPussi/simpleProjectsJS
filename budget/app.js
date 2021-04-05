// VARIABLES --------------------------------------------------------------
const allItems = []

//  DICTIONARYS ------------------------------------------------------------
const monthsByNumber = ["","Jan","Feb","Mar","Abr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dez"]
// QUERY SELECTORS---------------------------------------------------------
const toggleItemsElements = document.querySelectorAll(".toggle div")

const monthSelector = document.querySelector("#month")

// Tabs
const incomeTab = document.querySelector("#income")
const expenseTab = document.querySelector("#expense")
const investmentTab = document.querySelector("#investment")
const allTab = document.querySelector("#all")

// UL items list
const incomeList = document.querySelector("#income .list")
const expenseList = document.querySelector("#expense .list")
const investmentList = document.querySelector("#investment .list")
const allList = document.querySelector("#all .list")

// Income ADD stuff
const incomeTitleInput = document.querySelector("#income-title-input")
const incomeAmountInput = document.querySelector("#income-amount-input")
const incomeDateInput = document.querySelector("#income-date-input")
const incomeAdd = document.querySelector(".add-income")

// Expense ADD stuff
const expenseTitleInput = document.querySelector("#expense-title-input")
const expenseAmountInput = document.querySelector("#expense-amount-input")
const expenseDateInput = document.querySelector("#expense-date-input")
const expenseAdd = document.querySelector(".add-expense")

// Investment ADD stuff
const investmentTitleInput = document.querySelector("#investment-title-input")
const investmentAmountInput = document.querySelector("#investment-amount-input")
const investmentDateInput = document.querySelector("#investment-date-input")
const investmentAdd = document.querySelector(".add-investment")

// FUNCTIONS---------------------------------------------------------------

function deleteItem(itemNode){
    const index = allItems.findIndex(item => item.id == itemNode.id)
    allItems.splice(index, 1)
    saveItemsOnLocalStorage()
    applyFilter()
}

function editItem(itemNode) {
    const [title, amount] = itemNode.children[0].textContent.split(": $")
    if(itemNode.classList[0] == 'income'){
        incomeTitleInput.value = title
        incomeAmountInput.value = amount
    } else if(itemNode.classList[0] == "expense") {
        expenseTitleInput.value = title
        expenseAmountInput.value = amount
    } else {
        investmentTitleInput.value = title
        investmentAmountInput.value = amount
    }
    deleteItem(itemNode)
}

// Toggle between tabs
function toggleItems(e){

    // Switching active tab
    toggleItemsElements.forEach(item => item.classList.remove("active"))
    e.target.classList.add("active")

    // Hiding all tabs
    incomeTab.classList.add("hide")
    expenseTab.classList.add("hide")
    investmentTab.classList.add("hide")
    allTab.classList.add("hide")

    // Showing the right tab
    switch(e.target.classList[0]){
        case 'tab1':
            expenseTab.classList.remove("hide")
            break
        case 'tab2':
            incomeTab.classList.remove("hide")
            break
        case 'tab3':
            investmentTab.classList.remove("hide")
            break
        case 'tab4':
            allTab.classList.remove("hide")
            break
    }
}

function addIncome() {
    if(incomeTitleInput.value == '' || incomeAmountInput.value == '') return

    const data = {
        id: new Date().getTime(),
        competenceDate: formatDate(incomeDateInput.value),
        title: incomeTitleInput.value,
        amount: incomeAmountInput.value,
        type: 'income',
        list: incomeList
    }

    allItems.push(data)
    applyFilter()

    incomeTitleInput.value = ''
    incomeAmountInput.value = ''
}

function addInvestment() {
    if(investmentTitleInput.value == '' || investmentAmountInput.value == '') return

    const data = {
        id: new Date().getTime(),
        competenceDate: formatDate(investmentDateInput.value),
        title: investmentTitleInput.value,
        amount: investmentAmountInput.value,
        type: 'investment',
        list: investmentList
    }

    allItems.push(data)
    applyFilter()

    investmentTitleInput.value = ''
    investmentAmountInput.value = ''
}

function addExpense() {
    if(expenseTitleInput.value == '' || expenseAmountInput.value == '') return

    const data = {
        id: new Date().getTime(),
        competenceDate: formatDate(expenseDateInput.value),
        title: expenseTitleInput.value,
        amount: expenseAmountInput.value,
        type: 'expense',
        list: expenseList
    }

    allItems.push(data)
    applyFilter()

    expenseTitleInput.value = ''
    expenseAmountInput.value = ''
}

// Render data
function renderData(data){
    const {id, title, amount, type, list} = data

    const entry = ` <li id="${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;
    
        list.insertAdjacentHTML("afterbegin", entry)
        allList.insertAdjacentHTML("afterbegin", entry)
}

function updateUI(items){
    clearHTML()
    items.forEach(item => renderData(item))

    const totalInvestment = reducer("investment", items)
    const totalIncome = reducer("income", items)
    const totalEarnings = totalInvestment + totalIncome
    const totalOutcome = reducer("expense", items)

    document.querySelector(".income-total").textContent = "$"+totalIncome
    document.querySelector(".outcome-total").textContent = "$"+totalOutcome
    document.querySelector(".balance-container .balance .value").innerHTML = `${totalIncome-totalOutcome <0 ? '-' : ''} <small>R$</small> ${Math.abs(totalIncome-totalOutcome)}`
    document.querySelector(".balance-container .balance .value").style.color = totalIncome-totalOutcome >= 0 ? "#0F0" : '#f0624d'

    document.querySelector(".balance-container .investment .value").innerHTML = `<small>R$</small> ${Math.abs(totalInvestment)}`
    document.querySelector(".balance-container .investment .value").style.color = '#3939cc'
    
    saveItemsOnLocalStorage()

    if(totalIncome == 0 && totalOutcome == 0) return
    pieChart(totalIncome, totalOutcome, totalInvestment)

}

async function applyFilter(selectingDate=false){
    if(!selectingDate){
        await sortItems()
        generatePickerDates()
    }

    
    let monthYear = monthSelector.value
    let month = monthYear.slice(0,2)
    let year = monthYear.slice(2,6)

    const items = allItems.filter(item=>{
        const date = new Date(item.competenceDate)
        if(date.getMonth()+1 == month && date.getFullYear() == year){
            return true
        }
        return false
    })

    updateUI(items)
}


function sortItems(){
    allItems.sort(function(a,b){
        const aD = new Date(a.competenceDate)
        const bD = new Date(b.competenceDate)
        return aD-bD
    })
}
function reducer(type, items){
    return items.reduce((acc, cur)=>{
        if(cur.type != type){
            return acc
        }

        return acc+parseFloat(cur.amount)
    },0)
}

function clearHTML(){
    incomeList.innerHTML = ''
    expenseList.innerHTML = ''
    investmentList.innerHTML = ''
    allList.innerHTML = ''
}

function whereItClicked(e){
    if(e.target.id == 'edit'){
        editItem(e.target.parentNode)
    } else if(e.target.id == 'delete'){
        deleteItem(e.target.parentNode)
    }
}

function saveItemsOnLocalStorage(){
    localStorage.setItem("budgetAppItems", JSON.stringify(allItems))
}

function formatDate(value){
    const date = new Date(value.replace("-","/"))
    return `${addZeroToLeft(date.getMonth()+1)}/${addZeroToLeft(date.getDate())}/${date.getFullYear()}`
}

function getTodayDateFormated(){
    const today = new Date()
    return `${addZeroToLeft(today.getMonth()+1)}/${addZeroToLeft(today.getDate())}/${today.getFullYear()}`
}

function configDatePicker(){
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    monthSelector.value = `${addZeroToLeft(month+1)}${year}`

}

function addZeroToLeft(num){
    return num < 10 ? `0${num}` : num
}

function generatePickerDates(){
    if(allItems.length==0) return
    monthSelector.innerHTML=""

    const min = new Date(allItems[0].competenceDate)
    const minMonth = min.getMonth()+1
    const minYear = min.getFullYear()

    const max = new Date(allItems[allItems.length -1].competenceDate)
    const maxMonth = max.getMonth()+1
    const maxYear = max.getFullYear()

    for(let y=minYear;y<=maxYear;y++){
        if(y == maxYear){
            if(minYear == maxYear){
                for(m=minMonth;m<=maxMonth;m++){
                    monthSelector.innerHTML+=`<option value="${addZeroToLeft(m)}${y}">${monthsByNumber[m]}/${y}</option>`
                }
            }else{
                for(m=1;m<=maxMonth;m++){
                    monthSelector.innerHTML+=`<option value="${addZeroToLeft(m)}${y}">${monthsByNumber[m]}/${y}</option>`
                }
            }
        }else if(y==minYear){
            for(m=minMonth; m<=12;m++){
                monthSelector.innerHTML+=`<option value="${addZeroToLeft(m)}${y}">${monthsByNumber[m]}/${y}</option>`
            }
        } else {
            for(m=1; m<=12; m++){
                monthSelector.innerHTML+=`<option value="${addZeroToLeft(m)}${y}">${monthsByNumber[m]}/${y}</option>`
            }
        }
    }

    configDatePicker()
}

function retriveItemsOfLocalStorage(){
    let retrivedData = JSON.parse(localStorage.getItem("budgetAppItems"))
    if(retrivedData){
        retrivedData = retrivedData.map(data => {
            return {
                ...data,
                list: data.type == "income" ? incomeList : (data.type == "expense" ? expenseList : investmentList)
            }
        })
        allItems.push(...retrivedData)
        applyFilter()
    }
}
// EVENT LISTENERS---------------------------------------------------------
toggleItemsElements.forEach(item => item.addEventListener("click", toggleItems))
incomeAdd.addEventListener("click", addIncome)
expenseAdd.addEventListener("click", addExpense)
investmentAdd.addEventListener("click", addInvestment)

incomeTab.addEventListener("click", whereItClicked)
expenseTab.addEventListener("click", whereItClicked)
investmentTab.addEventListener("click", whereItClicked)
allTab.addEventListener("click", whereItClicked)

monthSelector.addEventListener("change", ()=>{applyFilter(true)})

retriveItemsOfLocalStorage()
