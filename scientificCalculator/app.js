// ------------------------- Query selectors -------------------------
const prev_operation = document.querySelector(".output__prev-operation")
const current_operation = document.querySelector(".output__current-operation")
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
let usingExp = false
let usingPow = false
let inv = false
let mod = 'deg'
let ans = '0'
let result
let visible_expression = '0'
let computer_expression = '0'
let pending_parenthesis = 0
const transactions = []
    // ------------------------- Functions -------------------------

// Math expressions
function log(x) {
    return Math.log(x) / Math.log(10)
}

function exp(x, y) {
    z = 10 ** Math.abs(y)

    if (y < 0) {
        return x / z
    } else if (y == 0) {
        return x
    } else {
        return x * z
    }
}

function fac(x) {
    let res = 1
    for (i = x; x > 1; x--) {
        res = x * res
    }
    return res
}

// Invert
function invert() {
    inv = !inv
    document.querySelector("[data-value='sin']").innerHTML = inv ? 'sin <sup>-1</sup>' : 'sin'
    document.querySelector("[data-value='cos']").innerHTML = inv ? 'cos <sup>-1</sup>' : 'cos'
    document.querySelector("[data-value='tan']").innerHTML = inv ? 'tan <sup>-1</sup>' : 'tan'
    document.querySelector("[data-value='ans']").innerHTML = inv ? 'Rnd' : 'Ans'
    document.querySelector("[data-value='in']").innerHTML = inv ? 'e <sup>x</sup>' : 'In'
    document.querySelector("[data-value='log']").innerHTML = inv ? '10 <sup>x</sup' : 'log'
    document.querySelector("[data-value='sqrt']").innerHTML = inv ? 'x <sup>2</sup' : '√'
    document.querySelector("[data-value='^']").innerHTML = inv ? 'soon' : 'x<sup>y</sup>'
}

function invertRd() {
    mod = mod == 'deg' ? 'rad' : 'deg'
    document.querySelector("[data-value='rd']").innerHTML = mod == 'deg' ? 'Rad&nbsp; <span class="less-opacity">| Deg</span>' : '<span class="less-opacity">Rad&nbsp; |</span>&nbsp; Deg'
}

// Set the transaction
function addTransaction() {

    const data = {
        visible: visible_expression,
        computer: computer_expression,
        lastWasAOperation,
        lastWasResult,
        nextNeedBeAOperator,
        nextCannotBeAOperator,
        lastWasAFunction,
        usingExp,
        usingPow,
        pending_parenthesis
    }
    transactions.push(data)
}

function reverseTransaction(at = false) {
    let last;
    if (at) {
        transactions.length = at;
    } else if (lastWasResult) {
        transactions.length = 0
    } else {
        last = transactions.pop()
    }

    let data = transactions[transactions.length - 1]
    if (data == undefined) {
        reset()
    } else {
        visible_expression = data.visible
        computer_expression = data.computer
        lastWasAOperation = data.lastWasAOperation
        lastWasResult = data.lastWasResult
        nextNeedBeAOperator = data.nextNeedBeAOperator
        nextCannotBeAOperator = data.nextCannotBeAOperator
        lastWasAFunction = data.lastWasAFunction
        usingExp = data.usingExp
        usingPow = data.usingPow
        pending_parenthesis = data.pending_parenthesis

        current_operation.textContent = visible_expression
    }

    if (transactions.length != 0 && last.visible == transactions[transactions.length - 1].visible) {
        reverseTransaction()
    }
}

function reset() {
    lastWasAOperation = false
    lastWasResult = false
    nextNeedBeAOperator = false
    nextCannotBeAOperator = false
    lastWasAFunction = false
    usingExp = false
    usingPow = false
    visible_expression = '0'
    computer_expression = '0'
    pending_parenthesis = 0
    current_operation.textContent = visible_expression
}

// Set the previous answer to the dom
function setLastAnswerFunction(text) {
    if (setLastAnswer === false) return
    setLastAnswer = false
    prev_operation.textContent = text
}

// Verify if the value in the visible expression is NaN or Infinity
function resultIsNotAValidNumber(type) {
    return typeof visible_expression == 'number' &&
        (isNaN(visible_expression) || !isFinite(visible_expression)) &&
        type != 'result'
}

// If the current expression is 0 or the last action was to show the result reset the expression
function blankExpressionIfNecessary(isNecessary = false) {
    if (visible_expression === '0' || lastWasResult || isNecessary) {
        visible_expression = ''
        computer_expression = ''
    }
}

// Pick the arg and put in both expressions (Add to or Set to)
function addSameValuesToBothExpressions(value) {
    visible_expression += value
    computer_expression += value
}

function setSameValuesToBothExpressions(value) {
    visible_expression = value
    computer_expression = value
}

// Pick the args and put within the equivalent variable (Add to or Set to)
function addDifferentValuesToExpressions(visible, computer) {
    visible_expression += visible
    computer_expression += computer
}

function setDifferentValuesToExpressions(visible, computer) {
    visible_expression = visible
    computer_expression = computer
}

// Slice expressions by determined value
function sliceExpressions(visible, computer) {
    visible_expression = visible_expression.slice(0, visible)
    computer_expression = computer_expression.slice(0, computer)

    const transaction_index = transactions.findIndex(transaction => transaction.visible == visible_expression)
    if (transaction_index > -1) {
        reverseTransaction(transaction_index)
    }

}

// Reset booleans to false
function resetBooleans(type) {
    if (type != 'result') {
        lastWasResult = false
    }

    if (type != 'simple_operation') {
        lastWasAOperation = false
    } else {
        lastWasAOperation = true
        nextNeedBeAOperator = false
    }

    if (type != 'sin' && type != 'cos' && type != 'tan' && type != 'log' && type != 'in' && type != 'sqrt') {
        lastWasAFunction = false
    }

    if (type == 'e' || type == 'pi' || type == 'percentage') {
        nextNeedBeAOperator = true
        nextCannotBeAOperator = false
    }

    if (type == 'op') {
        nextCannotBeAOperator = true
        nextNeedBeAOperator = false
    }
}

// By the type and the value, changes the expressions 
function setCurrentExpression(value, type) {
    if (resultIsNotAValidNumber(type)) {
        blankExpressionIfNecessary(true)
    }

    if (nextNeedBeAOperator && type != 'simple_operation' && type != 'result' && type != 'percentage' && type != 'cp') {
        addDifferentValuesToExpressions(" * ", '*')
        nextNeedBeAOperator = false
        lastWasAOperation = true
    }

    if (usingPow && (type == 'simple_operation' || type == '^') && value != "-") {
        computer_expression += ")"
        usingPow = false
    }

    if (usingPow && value == '-') {
        lastChunk = computer_expression.split("**")
        lastChunk = lastChunk[lastChunk.length - 1]
        if (lastChunk.includes("-")) {
            computer_expression += ")"
            usingPow = false
        }
    }

    if (usingExp && type != 'number') {
        let lastChunk = visible_expression.split(" ")
        lastChunk = lastChunk[lastChunk.length - 1]

        splitedE = lastChunk.split("E")
        splitedE = lastChunk[lastChunk.length - 1]

        let minus = visible_expression[visible_expression.length - 1] == '-' || splitedE.includes("-")
        if (minus && value == '-') return

        if (value == '-') {
            computer_expression += '-'
            visible_expression += '-'
            current_operation.textContent = visible_expression
        }

        const lastNumber = visible_expression.match(/E[0-9]+(?!.*[0-9])$/)
        if (lastNumber === null) return

        computer_expression += ")"
        nextNeedBeAOperator = true
        usingExp = false

    }
    if (type == 'number') {
        blankExpressionIfNecessary()
        addSameValuesToBothExpressions(value)
        nextCannotBeAOperator = false
    } else if (type == 'simple_operation') {

        if (current_operation.textContent == '0' && value == '-') {
            setSameValuesToBothExpressions("")
        }
        if (nextCannotBeAOperator) return

        // Slice off the last operator, if the previous action was a operation
        if (lastWasAOperation) {
            sliceExpressions(-3, -1)
        }
        if (visible_expression.length == 0 && value != "-") {
            addSameValuesToBothExpressions("0")
        }

        addDifferentValuesToExpressions(` ${value} `, value)
    } else if (type == 'pi' || type == 'e') {
        if (!lastWasAOperation && computer_expression[computer_expression.length - 1] != "(" && computer_expression[computer_expression.length - 1] != '*') {
            computer_expression += '*'
        }
        blankExpressionIfNecessary()
        if (type == 'pi') {
            addDifferentValuesToExpressions('π', 'Math.PI')
        } else {
            addDifferentValuesToExpressions('e', 'Math.E')
        }
    } else if (type == 'dot') {
        if (nextCannotBeAOperator) return

        // Catches the last block of the account
        let splited = visible_expression.match(/\S+/g) || []
        splited = splited[splited.length - 1]

        const expressionCurrentlyEndsWithNumber = visible_expression.match(/[0-9]+(?!.*[0-9])$/) != null

        if (splited.indexOf('.') != -1 || !expressionCurrentlyEndsWithNumber) return
        blankExpressionIfNecessary()

        console.log(splited)
        if (visible_expression == '') {
            setSameValuesToBothExpressions("0")
        }
        addSameValuesToBothExpressions(".")
    } else if (type == 'percentage') {
        if (nextCannotBeAOperator) return
        if (lastWasAOperation) {
            sliceExpressions(-3, -1)
        }

        // Catches the penultimate and antipenultimate block of the account
        let splited = visible_expression.match(/\S+/g) || []
        let pen_splited = splited[splited.length - 2]
        let ant_splited = splited[splited.length - 3]

        addDifferentValuesToExpressions('%', '/100')

        if (splited.length >= 3 && (pen_splited.includes("+") || pen_splited.includes("-"))) {
            computer_expression += `*${ant_splited.replace("%",'/100')}`
        }

        if (splited.length >= 3 && pen_splited.includes("/")) {
            computer_expression += "*10000"
        }
    } else if (type == 'op') {
        if (computer_expression[computer_expression.length - 1] == "(") {
            computer_expression += '1*'
        } else if (!lastWasAOperation && !lastWasAFunction) {
            computer_expression += '*'
        }

        addSameValuesToBothExpressions('(')
        pending_parenthesis++
    } else if (type == 'cp') {
        if (nextCannotBeAOperator) return

        if (pending_parenthesis === 0 || lastWasAOperation) {
            return false
        }
        addSameValuesToBothExpressions(')')
        pending_parenthesis--
    } else if (type == 'sqrt') {
        blankExpressionIfNecessary()

        if (inv) {
            const lastNumber = visible_expression.match(/[0-9]+(?!.*[0-9])$/)
            if (!lastNumber) return
            addDifferentValuesToExpressions("^2", '**2')
            nextNeedBeAOperator = true
        } else {
            if (computer_expression[computer_expression.length - 1] == "(") {
                computer_expression += '1*'
            } else if (!lastWasAOperation && computer_expression.length != 0) {
                computer_expression += '*'
            }
            addDifferentValuesToExpressions(' √', 'Math.sqrt')
            setCurrentExpression('', 'op')
            lastWasAFunction = true
        }
        resetBooleans(type)
    } else if (type == 'sin') {
        blankExpressionIfNecessary()
        if (computer_expression[computer_expression.length - 1] == "(") {
            computer_expression += '1*'
        } else if (!lastWasAOperation && computer_expression.length != 0) {
            computer_expression += '*'
        }

        if (inv) {
            addDifferentValuesToExpressions(' arcsin', 'Math.asin')
        } else {
            addDifferentValuesToExpressions(' sin', 'Math.sin')
        }
        lastWasAFunction = true
        resetBooleans(type)
        setCurrentExpression('', 'op')
        if (mod == 'rad') {
            computer_expression += "Math.PI/180*"
        }
    } else if (type == 'cos') {
        blankExpressionIfNecessary()
        if (computer_expression[computer_expression.length - 1] == "(") {
            computer_expression += '1*'
        } else if (!lastWasAOperation && computer_expression.length != 0) {
            computer_expression += '*'
        }

        if (inv) {
            addDifferentValuesToExpressions(' arccos', 'Math.acos')
        } else {
            addDifferentValuesToExpressions(' cos', 'Math.cos')
        }

        lastWasAFunction = true
        resetBooleans(type)
        setCurrentExpression('', 'op')
        if (mod == 'rad') {
            computer_expression += "Math.PI/180*"
        }
    } else if (type == 'tan') {
        blankExpressionIfNecessary()
        if (computer_expression[computer_expression.length - 1] == "(") {
            computer_expression += '1*'
        } else if (!lastWasAOperation && computer_expression.length != 0) {
            computer_expression += '*'
        }

        if (inv) {
            addDifferentValuesToExpressions(' arctan', 'Math.atan')
        } else {
            addDifferentValuesToExpressions(' tan', 'Math.tan')
        }
        lastWasAFunction = true
        resetBooleans(type)
        setCurrentExpression('', 'op')
        if (mod == 'rad') {
            computer_expression += "Math.PI/180*"
        }
    } else if (type == 'in') {
        blankExpressionIfNecessary()

        if (inv) {
            if (!lastWasAOperation && computer_expression.length != 0) {
                addDifferentValuesToExpressions(" * ", '*')
            }
            addDifferentValuesToExpressions("e", 'Math.E')
            lastWasAFunction = false
            setCurrentExpression("", '^')

        } else {
            if (computer_expression[computer_expression.length - 1] == "(") {
                computer_expression += '1*'
            } else if (!lastWasAOperation && computer_expression.length != 0) {
                computer_expression += '*'
            }

            addDifferentValuesToExpressions(' In', 'Math.log')
            lastWasAFunction = true
            resetBooleans(type)
            setCurrentExpression('', 'op')
        }

    } else if (type == 'log') {
        blankExpressionIfNecessary()

        if (inv) {
            if (!lastWasAOperation && computer_expression.length != 0) {
                addDifferentValuesToExpressions(" * ", '*')
            }
            addSameValuesToBothExpressions("10")
            resetBooleans(type)
            setCurrentExpression("", '^')

        } else {
            if (computer_expression[computer_expression.length - 1] == "(") {
                computer_expression += '1*'
            } else if (!lastWasAOperation && computer_expression.length != 0) {
                computer_expression += '*'
            }

            addDifferentValuesToExpressions(' log', 'log')
            lastWasAFunction = true
            setCurrentExpression('', 'op')
            resetBooleans(type)
        }

    } else if (type == 'exp') {

        const lastNumber = visible_expression.match(/[0-9]+(?!.*[0-9])$/)
        let lastChunk = visible_expression.split(" ")
        lastChunk = lastChunk[lastChunk.length - 1]

        if (lastNumber == null || lastChunk.includes("E")) return

        computer_expression = computer_expression.replace(/[0-9]+(?!.*[0-9])$/, `exp(${lastNumber[0]},`)
        visible_expression += "E"
        usingExp = true
    } else if (type == '^') {
        if (inv && value == "^") {
            return false
            const lastNumber = visible_expression.match(/[0-9]+(?!.*[0-9])$/)
            if (lastNumber == null) return
        } else {
            const lastNumber = visible_expression.match(/[0-9]+(?!.*[0-9])$/)
            const isE = visible_expression[visible_expression.length - 1] == 'e'
            if (lastNumber == null && !isE) return

            computer_expression += "**("
            visible_expression += "^"
            usingPow = true
        }

    } else if (type == 'factorial') {
        const lastNumber = visible_expression.match(/[0-9]+(?!.*[0-9])$/)
        if (lastNumber == null) return

        computer_expression = computer_expression.replace(/[0-9]+(?!.*[0-9])$/, `fac(${lastNumber[0]})`)
        visible_expression += "!"
        nextNeedBeAOperator = true
    } else if (type == 'ans') {
        if (!lastWasAOperation && computer_expression[computer_expression.length - 1] != "(" && computer_expression[computer_expression.length - 1] != '*') {
            computer_expression += '*'
        }
        blankExpressionIfNecessary()
        addDifferentValuesToExpressions(" Ans", ans)
    }

    resetBooleans(type)
    current_operation.textContent = visible_expression
    addTransaction()

}

// Close open parenthesis
function closesParenthesis() {
    current_operation.setAttribute('data-parenthesis', '')

    for (i = 1; i <= pending_parenthesis; i++) {
        computer_expression += ')'
        visible_expression += ')'
    }
}

function showParenthesis() {
    let parenthesis = ''
    for (i = 1; i <= pending_parenthesis; i++) {
        parenthesis += ')'
    }

    current_operation.setAttribute('data-parenthesis', parenthesis)
    current_operation.style.paddingRight = `${pending_parenthesis*10}px`

}

function evaluateResult() {
    if (usingExp || usingPow) {
        computer_expression += ")"
        usingExp = false
        usingPow = false
    }
    console.log(computer_expression)
    try {
        result = eval(computer_expression)
    } catch (e) {
        result = NaN
    }


    if (`${result}`.includes('e-')) {
        setSameValuesToBothExpressions(result)
    } else {
        setSameValuesToBothExpressions(+parseFloat(result).toFixed(9))
    }
    setCurrentExpression('', 'result')
    pending_parenthesis = 0
}

function identifyClickedButton() {
    setLastAnswerFunction('Ans = 0')
    const clickedButton = this.dataset.value

    if (lastWasResult && clickedButton != '=') {
        setLastAnswer = true
        ans = current_operation.textContent
        setLastAnswerFunction(`Ans = ${current_operation.textContent}`)
    }

    switch (clickedButton) {
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
        case '^':
            setCurrentExpression("^", clickedButton)
            break
        case 'inv':
            invert()
            break
        case 'rd':
            invertRd()
            break
        case 'ac':
            reverseTransaction()
            break;
        case '=':
            if (lastWasAOperation) return
            closesParenthesis()
            if (!lastWasResult) {
                setLastAnswer = true
                setLastAnswerFunction(`${visible_expression} =`)
            }
            evaluateResult()
            lastWasResult = true
            break
        default:
            setCurrentExpression('', clickedButton)
            break
    }

    showParenthesis()
}