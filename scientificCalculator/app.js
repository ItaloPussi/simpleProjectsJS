// ------------------------- Query selectors -------------------------
const prev_operation = document.querySelector(".output__prev-operation")
const current_operation = document.querySelector(".output__current-operation")
const rad_deg_div = document.querySelector("[data-value='rd']")
const buttons = document.querySelectorAll(".calculator__btn")

// ------------------------- Event Listeners -------------------------
buttons.forEach(button => button.addEventListener("click", identifyClickedButton))

// ------------------------- Global Variables -------------------------
let setLastAnswer = true
let visible_expression = '0'
let computer_expression = '0'
let lastWasAOperation = false
let lastWasResult = false
let nextNeedBeAOperator = false
// ------------------------- Functions -------------------------

function setLastAnswerFunction(text){
    if(setLastAnswer === false) return
    setLastAnswer = false
    prev_operation.textContent = text
}

function setCurrentExpression(value, type){
    if(typeof visible_expression == 'number' && (isNaN(visible_expression) || !isFinite(visible_expression)) && type !='result'){
        visible_expression = ''
        computer_expression = ''
    }

    if(nextNeedBeAOperator && type !='simple_operation' && type != 'result'){
        visible_expression+=" * "
        computer_expression+='*'
        nextNeedBeAOperator = false
        lastWasAOperation = true
    }

    if(type == 'number') {
        if(visible_expression === '0' || lastWasResult){
            visible_expression = ''
            computer_expression = ''
        }

        visible_expression+=value
        computer_expression+=value
        lastWasAOperation = false
    } else if(type == 'simple_operation'){
        if(lastWasAOperation){
            visible_expression = visible_expression.slice(0, -3)
            computer_expression = computer_expression.slice(0,-1)
        }
        if(visible_expression.length==0){
            visible_expression = '0'
            computer_expression = '0'
        }

        visible_expression = `${visible_expression} ${value} `
        computer_expression = `${computer_expression}${value}`
        lastWasAOperation = true
        nextNeedBeAOperator = false

    } else if(type == 'pi'){
        if(visible_expression === '0' || lastWasResult){
            visible_expression = ''
            computer_expression = ''
            computer_expression+='Math.PI' 
        }else if(!lastWasAOperation){
            computer_expression+='*Math.PI' 
        }
        visible_expression += 'π'
    } else if(type == 'dot') {
        let splited = visible_expression.match(/\S+/g) || []
        splited = splited[splited.length-1]

        if(splited.indexOf('.') !=-1) return
        if(visible_expression === '0' || lastWasResult){
            visible_expression = ''
            computer_expression = ''
        }

        visible_expression+='.'
        computer_expression+='.'
        lastWasAOperation = false
    } else if(type == 'percentage'){
        if(lastWasAOperation){
            visible_expression = visible_expression.slice(0, -3)
            computer_expression = computer_expression.slice(0,-1)
        }
        visible_expression+='%'
        computer_expression+='/100'
        lastWasAOperation = false
    }

    if(type != 'result'){
        lastWasResult = false
    }

    current_operation.textContent = visible_expression
}

function evaluateResult() {
    let result
    try{
        result = eval(computer_expression)
    } catch(e){
        result = NaN
    }

    visible_expression = result
    computer_expression = result
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
            setCurrentExpression('π', 'pi')
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