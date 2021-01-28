// ------------------------- Query selectors -------------------------
const prev_operation = document.querySelector(".output__prev-operation")
const current_operation = document.querySelector(".output__current-operation")
const rad_deg_div = document.querySelector("[data-value='rd']")
const buttons = document.querySelectorAll(".calculator__btn")

// ------------------------- Event Listeners -------------------------
buttons.forEach(button => button.addEventListener("click", identifyClickedButton))

// ------------------------- Global Variables -------------------------
let setLastAnswer = true
let lastWasAOperation = false
let lastWasResult = false
let nextNeedBeAOperator = false
let result
let visible_expression = '0'
let computer_expression = '0'
// ------------------------- Functions -------------------------

// Set the previous answer to the dom
function setLastAnswerFunction(text){
    if(setLastAnswer === false) return
    setLastAnswer = false
    prev_operation.textContent = text
}

// Verify if the value in the visible expression is NaN or Infinity
function resultIsNotAValidNumber(type) {
    return typeof visible_expression == 'number' && 
    (isNaN(visible_expression) || !isFinite(visible_expression)) &&
    type !='result'
}

// If the current expression is 0 or the last action was to show the result reset the expression
function blankExpressionIfNecessary(isNecessary = false){
    if(visible_expression === '0' || lastWasResult || isNecessary){
        visible_expression = ''
        computer_expression = ''
    }
}

// Pick the arg and put in both expressions (Add to or Set to)
function addSameValuesToBothExpressions(value){
    visible_expression+=value
    computer_expression+=value
}

function setSameValuesToBothExpressions(value){
    visible_expression = value
    computer_expression = value
}

// Pick the args and put within the equivalent variable (Add to or Set to)
function addDifferentValuesToExpressions(visible, computer){
    visible_expression+=visible
    computer_expression+=computer
}

function setDifferentValuesToExpressions(visible, computer){
    visible_expression = visible
    computer_expression = computer
}

// Slice expressions by determined value
function sliceExpressions(visible, computer){
    visible_expression = visible_expression.slice(0, visible)
    computer_expression = computer_expression.slice(0, computer)

}

// Reset booleans to false
function resetBooleans(type){
    if(type != 'result'){
        lastWasResult = false
    }
    
    if(type != 'simple_operation'){
        lastWasAOperation = false
    }
}

// By the type and the value, changes the expressions 
function setCurrentExpression(value, type){
    if(resultIsNotAValidNumber(type)){
        blankExpressionIfNecessary(true)
    }

    if(nextNeedBeAOperator && type !='simple_operation' && type != 'result' && type!= 'percentage'){
        addDifferentValuesToExpressions(" * ", '*')
        nextNeedBeAOperator = false
        lastWasAOperation = true
    }

    if(type == 'number') {
        blankExpressionIfNecessary()
        addSameValuesToBothExpressions(value)
    } else if(type == 'simple_operation'){
        if(lastWasAOperation){
            sliceExpressions(-3, -1)
        }
        if(visible_expression.length==0){
            addSameValuesToBothExpressions("0")
        }

        addDifferentValuesToExpressions(` ${value} `, value)
        lastWasAOperation = true
        nextNeedBeAOperator = false

    } else if(type == 'pi'){
        blankExpressionIfNecessary()
        addDifferentValuesToExpressions('π', 'Math.PI')
    } else if(type == "e"){
        blankExpressionIfNecessary()
        addDifferentValuesToExpressions('e', 'Math.E')

    }else if(type == 'dot') {
        let splited = visible_expression.match(/\S+/g) || []
        splited = splited[splited.length-1]

        if(splited.indexOf('.') !=-1) return
        blankExpressionIfNecessary()

        addSameValuesToBothExpressions(".")
    } else if(type == 'percentage'){
        if(lastWasAOperation){
            sliceExpressions(-3, -1)
        }

        let splited = visible_expression.match(/\S+/g) || []
        let pen_splited = splited[splited.length -2]
        let ant_splited = splited[splited.length -3]

        addDifferentValuesToExpressions('%', '/100')

        if(splited.length>=3 && (pen_splited.includes("+") || pen_splited.includes("-") )){
            computer_expression+=`*${ant_splited.replace("%",'/100')}`
        }

        if(splited.length>=3 && pen_splited.includes("/")){
            computer_expression+="*10000"
        }
        nextNeedBeAOperator = false
    }

    resetBooleans(type)
    current_operation.textContent = visible_expression
}

function evaluateResult() {
    try{
        result = eval(computer_expression)
    } catch(e){
        result = NaN
    }

    setSameValuesToBothExpressions(+parseFloat(result).toFixed(9))
    setCurrentExpression('','result')
}

function identifyClickedButton(){
    setLastAnswerFunction('Ans = 0')
    const clickedButton = this.dataset.value

    if(lastWasResult && clickedButton!='='){
        setLastAnswer = true
        setLastAnswerFunction(`Ans = ${current_operation.textContent}`)
    }

    switch(clickedButton){
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":   
        case "0":
            setCurrentExpression(clickedButton, 'number')
            break
        case '+':
        case '-':
        case '*':
        case '/':
            setCurrentExpression(clickedButton, 'simple_operation')
            break
        case '=':
            if(!lastWasResult){
                setLastAnswer = true
                setLastAnswerFunction(`${visible_expression} =`)
            }
            evaluateResult()
            lastWasResult = true
            break
        case 'pi':
        case 'e':
            setCurrentExpression('', clickedButton)
            nextNeedBeAOperator = true
            break
        case '.':
            setCurrentExpression('.','dot')
            break
        case '%':
            setCurrentExpression('&', 'percentage')
            nextNeedBeAOperator = true
            break
        default:
            alert('Sorry, this part is not ready yet!')
    }
}