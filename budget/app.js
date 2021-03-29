// VARIABLES --------------------------------------------------------------
const items = []

// QUERY SELECTORS---------------------------------------------------------
const toggleItemsElements = document.querySelectorAll(".toggle div")

// Tabs
const incomeTab = document.querySelector("#income")
const expenseTab = document.querySelector("#expense")
const allTab = document.querySelector("#all")

// UL items list
const incomeList = document.querySelector("#income .list")
const expenseList = document.querySelector("#expense .list")
const allList = document.querySelector("#all .list")

// Income ADD stuff
const incomeTitleInput = document.querySelector("#income-title-input")
const incomeAmountInput = document.querySelector("#income-amount-input")
const incomeAdd = document.querySelector(".add-income")

// Expense ADD stuff
const expenseTitleInput = document.querySelector("#expense-title-input")
const expenseAmountInput = document.querySelector("#expense-amount-input")
const expenseAdd = document.querySelector(".add-expense")

// FUNCTIONS---------------------------------------------------------------

function deleteItem(itemNode){
    const index = items.findIndex(item => item.id == itemNode.id)
    items.splice(index, 1)
    updateUI()
}

function editItem(itemNode) {
    const [title, amount] = itemNode.children[0].textContent.split(": $")
    if(itemNode.classList[0] == 'income'){
        incomeTitleInput.value = title
        incomeAmountInput.value = amount
    } else {
        expenseTitleInput.value = title
        expenseAmountInput.value = amount
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
            allTab.classList.remove("hide")
            break
    }
}

function addIncome() {
    if(incomeTitleInput.value == '' || incomeAmountInput.value == '') return

    const data = {
        id: new Date().getTime(),
        title: incomeTitleInput.value,
        amount: incomeAmountInput.value,
        type: 'income',
        list: incomeList
    }

    items.push(data)
    updateUI()

    incomeTitleInput.value = ''
    incomeAmountInput.value = ''
}

function addExpense() {
    if(expenseTitleInput.value == '' || expenseAmountInput.value == '') return

    const data = {
        id: new Date().getTime(),
        title: expenseTitleInput.value,
        amount: expenseAmountInput.value,
        type: 'expense',
        list: expenseList
    }

    items.push(data)
    updateUI()

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

function updateUI(){
    clearHTML()
    items.forEach(item => renderData(item))
    saveItemsOnLocalStorage()
}

function clearHTML(){
    incomeList.innerHTML = ''
    expenseList.innerHTML = ''
    allList.innerHTML = ''
}

function whereItClicked(e){
    console.log(e.target)
    if(e.target.id == 'edit'){
        editItem(e.target.parentNode)
    } else if(e.target.id == 'delete'){
        deleteItem(e.target.parentNode)
    }
}

function saveItemsOnLocalStorage(){
    localStorage.setItem("budgetAppItems", JSON.stringify(items))
}

function retriveItemsOfLocalStorage(){
    let retrivedData = JSON.parse(localStorage.getItem("budgetAppItems"))
    if(retrivedData){
        retrivedData = retrivedData.map(data => {
            return {
                ...data,
                list: data.type == "income" ? incomeList : expenseList
            }
        })
        items.push(...retrivedData)
        console.log(items)
        updateUI()
    }
}
// EVENT LISTENERS---------------------------------------------------------
toggleItemsElements.forEach(item => item.addEventListener("click", toggleItems))
incomeAdd.addEventListener("click", addIncome)
expenseAdd.addEventListener("click", addExpense)

incomeTab.addEventListener("click", whereItClicked)
expenseTab.addEventListener("click", whereItClicked)
allTab.addEventListener("click", whereItClicked)

retriveItemsOfLocalStorage()