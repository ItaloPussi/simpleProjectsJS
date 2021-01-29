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
let nextCannotBeAOperator = false
let lastWasAFunction = false
let result
let visible_expression = '0'
let computer_expression = '0'
let pending_parenthesis = 0
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

    if(type != 'sin' && type != 'cos' && type != 'tan'){
        lastWasAFunction = false
    }
}

// By the type and the value, changes the expressions 
function setCurrentExpression(value, type){
    if(resultIsNotAValidNumber(type)){
        blankExpressionIfNecessary(true)
    }

    if(nextNeedBeAOperator && type !='simple_operation' && type != 'result' && type!= 'percentage' && type!= 'cp'){
        addDifferentValuesToExpressions(" * ", '*')
        nextNeedBeAOperator = false
        lastWasAOperation = true
    }

    if(type == 'number') {
        blankExpressionIfNecessary()
        addSameValuesToBothExpressions(value)
        nextCannotBeAOperator = false
    } else if(type == 'simple_operation'){
        if(nextCannotBeAOperator) return
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
        if(!lastWasAOperation && computer_expression[computer_expression.length-1] != "("){
            computer_expression+='*'
        }
        blankExpressionIfNecessary()
        addDifferentValuesToExpressions('π', 'Math.PI')
        nextCannotBeAOperator = false

    } else if(type == "e"){
        if(!lastWasAOperation && computer_expression[computer_expression.length-1] != "("){
            computer_expression+='*'
        }
        blankExpressionIfNecessary()
        addDifferentValuesToExpressions('e', 'Math.E')
        nextCannotBeAOperator = false

    }else if(type == 'dot') {
        if(nextCannotBeAOperator) return
        let splited = visible_expression.match(/\S+/g) || []
        splited = splited[splited.length-1]

        if(splited.indexOf('.') !=-1) return
        blankExpressionIfNecessary()

        addSameValuesToBothExpressions(".")
    } else if(type == 'percentage'){
        if(nextCannotBeAOperator) return
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
        nextNeedBeAOperator = true

    } else if(type == 'op'){
        if(computer_expression[computer_expression.length-1] == "("){
            computer_expression+='1*'
        } else if(!lastWasAOperation && !lastWasAFunction){
            computer_expression+='*'
        }

        addSameValuesToBothExpressions('(')
        pending_parenthesis++
        resetBooleans(type)
        nextCannotBeAOperator = true
    } else if(type == 'cp'){
        if(nextCannotBeAOperator) return

        if(pending_parenthesis === 0 || lastWasAOperation){
            return false
        }
        addSameValuesToBothExpressions(')')
        pending_parenthesis--
    } else if(type == 'sin'){
        if(computer_expression[computer_expression.length-1] == "("){
            computer_expression+='1*'
        } else if(!lastWasAOperation){
            computer_expression+='*'
        }

        addDifferentValuesToExpressions(' sin', 'Math.sin')
        lastWasAFunction = true
        resetBooleans(type)
        setCurrentExpression('','op')
    } else if(type == 'cos'){
        if(computer_expression[computer_expression.length-1] == "("){
            computer_expression+='1*'
        } else if(!lastWasAOperation){
            computer_expression+='*'
        }

        addDifferentValuesToExpressions(' cos', 'Math.cos')
        lastWasAFunction = true
        resetBooleans(type)
        setCurrentExpression('','op')
    } else if(type == 'tan'){
        if(computer_expression[computer_expression.length-1] == "("){
            computer_expression+='1*'
        } else if(!lastWasAOperation){
            computer_expression+='*'
        }

        addDifferentValuesToExpressions(' tan', 'Math.tan')
        lastWasAFunction = true
        resetBooleans(type)
        setCurrentExpression('','op')
    }

    resetBooleans(type)
    current_operation.textContent = visible_expression
}

// Close open parenthesis
function closesParenthesis(){
    current_operation.setAttribute('data-parenthesis', '')

    for(i = 1; i<=pending_parenthesis; i++){
        computer_expression+=')'
        visible_expression+=')'
    }
}

function showParenthesis(){
    let parenthesis = ''
    for(i = 1; i<=pending_parenthesis; i++){
        parenthesis+=')'
    }

    current_operation.setAttribute('data-parenthesis', parenthesis)
    current_operation.style.paddingRight = `${pending_parenthesis*10}px`
    
}
function evaluateResult() {
    
    try{
        result = eval(computer_expression)
    } catch(e){
        result = NaN
    }

    setSameValuesToBothExpressions(+parseFloat(result).toFixed(9))
    setCurrentExpression('','result')
    pending_parenthesis = 0
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
            if(lastWasAOperation) return
            closesParenthesis()
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
        case 'sin':
        case 'cos':
        case 'tan':
        case 'op':
        case 'cp':
            setCurrentExpression('', clickedButton)
            break;
        case '.':
            setCurrentExpression('.','dot')
            break
        case '%':
            setCurrentExpression('&', 'percentage')
            break
        default:
            alert('Sorry, this part is not ready yet!')
    }

    showParenthesis()
}