//basic maths functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        return "Error";
    }
    return a / b;
}
//main calculator function
function calculate(operator, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    switch (operator) {
        case 'add':
            return add(a, b);
        case 'subtract':
            return subtract(a, b);
        case 'multiply':
            return multiply(a, b);
        case 'divide':
            return divide(a, b);
        default:
            return null;    
    }             
}


//calculator state variables
let firstNumber = '';
let secondNumber = '';
let currentOperator = null;
let shouldResetDisplay = false;

//dom elements
const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.btn.number');
const operatorButtons = document.querySelectorAll('.btn.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const decimalButton = document.getElementById('decimal');

//display update function
function updateDisplay(value) {
    if (value.toString().length > 12) {
        display.textContent = parseFloat(value).toExponential(5);
    } else {
        display.textContent = value;
    }
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        display.textContent = '';
        shouldResetDisplay = false;
    }

    if (display.textContent === '0' ) {
        display.textContent = number;
    } else {
        display.textContent += number;
    }
}

function appendDecimal() {
    if (shouldResetDisplay) {
        display.textContent = '0';
        shouldResetDisplay = false;
    }
    //don't allow multiple decimals
    if (display.textContent.includes('.')) return;
    display.textContent += '.';
}

function clearDisplay() {
    display.textContent = '0';
    firstNumber = '';
    secondNumber = '';
    currentOperator = null;
    shouldResetDisplay = false;
}

function backspace() {
    if (shouldResetDisplay) return;

    if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
}

function handleOperator(operator) {
    const currentValue = display.textContent;
    //if there's already an operator, calculate the result first
    if (currentOperator !== null && !shouldResetDisplay) {
        secondNumber = currentValue;
        const result = calculate(currentOperator, firstNumber, secondNumber);
        updateDisplay(roundResult(result));
        firstNumber = display.textContent;
    }else {
        firstNumber = currentValue;
    
    }
    currentOperator = operator;
    shouldResetDisplay = true;
}

function handleEquals() {
    if (currentOperator === null) return;
    if (shouldResetDisplay) return;

    secondNumber = display.textContent;
    const result = calculate(currentOperator, firstNumber, secondNumber);
    updateDisplay(roundResult(result));
    currentOperator = null;
    shouldResetDisplay = true;
}

function roundResult(number) {
    if (typeof number === 'string') return number;
    return Math.round(number * 100000000) / 100000000;
}


//event listeners
numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        handleOperator(button.dataset.operator);
    });
});

equalsButton.addEventListener('click', handleEquals);
clearButton.addEventListener('click', clearDisplay);
backspaceButton.addEventListener('click', backspace);
decimalButton.addEventListener('click', appendDecimal);


//keyboard support
document.addEventListener('keydown', (e) => {
    //numbers
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    }
    //operators
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    }
    //equals
    if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
    }
    //clear
    if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearDisplay();
    }
    //backspace
    if (e.key === 'Backspace') {
        backspace();
    }
    //decimal
    if (e.key === '.') {
        appendDecimal();
    }
});

console.log("Calculator is ready.");