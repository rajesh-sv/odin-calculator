const DEFAULT_DISPLAY_NUMBER = "0";
const expressionItemArr = [];
const operate = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  "^": (a, b) => a ^ b,
}

let decimalUsed;
let currentNumber;
let mathExpression;
let closeBracketAllowedCount;

const expressionDisplay = document.querySelector(".expression-display");
const numberDisplay = document.querySelector(".number-display");

const clearButton = document.getElementById('clear-button');
const deleteButton = document.getElementById('delete-button');

const openBracket = document.getElementById('open-bracket-button');
const closeBracket = document.getElementById('close-bracket-button');

const decimalButton = document.querySelector('.decimal');
const equalToButton = document.querySelector('.equal-to');

const operatorButtons = Array.from(document.querySelectorAll('.operator'));
operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener('click', (event) => {
    const operator = event.target.value;
    if (expressionItemArr.length) {
      if (expressionItemArr[expressionItemArr.length-1] === ")" || typeof expressionItemArr[expressionItemArr.length-1] === "number")
        pushOperatorToExpression(operator);
      else if (isOperator(expressionItemArr[expressionItemArr.length-1]))
        popPushOperatorToExpression(operate);
    } else {
      pushCurrentNumberToExpression();
      pushOperatorToExpression();
    }
  });
});

const numberButtons = Array.from(document.querySelectorAll('.number'));
numberButtons.forEach((numberButton) => {
  numberButton.addEventListener('click', (event) => {
    const digit = event.target.value;
    pushDigitToCurrentNumber(digit);
  });
});


window.onload = () => {
  initialize();
}

clearButton.addEventListener('click', () => {
  initialize();
});

deleteButton.addEventListener('click', () => {
  currentNumber = currentNumber.slice(0, currentNumber.length-1);
  if (!currentNumber.length)
    currentNumber = DEFAULT_DISPLAY_NUMBER;
  else if (currentNumber[currentNumber.length-1] === ".") {
    decimalUsed = false;
    decimalButton.classList.toggle('greyed');
    currentNumber = currentNumber.slice(0, currentNumber.length-1);
  }
  updateDisplayNumber();
});

openBracket.addEventListener('click', () => {
  if (!expressionItemArr.length || isOperator(expressionItemArr[expressionItemArr.length-1]) || expressionItemArr[expressionItemArr.length-1] === "(") {
    ++closeBracketAllowedCount;
    mathExpression += "(";
    expressionItemArr.push("(");
    updateDisplayExpression();
  }
});

closeBracket.addEventListener('click', () => {
  if (closeBracketAllowedCount && typeof expressionItemArr[expressionItemArr.length-1] !== "number") {
    --closeBracketAllowedCount;
    if (expressionItemArr[expressionItemArr.length-1] !== ")")
      pushCurrentNumberToExpression();
    mathExpression += ")";
    expressionItemArr.push(")");
    updateDisplayExpression();
  }
});

decimalButton.addEventListener('click', () => {
  if (!decimalUsed) {
    decimalUsed = true;
    decimalButton.classList.toggle('greyed');
    pushDecimalToCurrentNumber();
  }
});

equalToButton.addEventListener('click', () => {
  pushCurrentNumberToExpression();

});

function initialize() {
  decimalUsed = false;
  currentNumber = DEFAULT_DISPLAY_NUMBER;
  mathExpression = "";
  expressionItemArr.length = 0;
  closeBracketAllowedCount = 0;
  updateDisplayNumber();
  updateDisplayExpression();
}

function updateDisplayNumber() {
  numberDisplay.textContent = currentNumber;
}

function updateDisplayExpression() {
  expressionDisplay.textContent = mathExpression;
}

function isOperator(operator) {
  return operator in operate;
}

function pushCurrentNumberToExpression() {
  mathExpression += currentNumber;
  expressionItemArr.push(Number(currentNumber));
  currentNumber = DEFAULT_DISPLAY_NUMBER;
  updateDisplayExpression();
  updateDisplayNumber();
}

function pushOperatorToExpression(operator) {
  mathExpression += operator;
  expressionItemArr.push(operator);
  updateDisplayExpression();
}

function popPushOperatorToExpression(operator) {
  mathExpression = mathExpression.slice(0, mathExpression.length-1) + operator;
  expressionItemArr.pop();
  expressionItemArr.push(operator);
  updateDisplayExpression();
}

function pushDigitToCurrentNumber(digit) {
  if (currentNumber === DEFAULT_DISPLAY_NUMBER)
    currentNumber = "";
  currentNumber += digit;
  updateDisplayNumber();
}

function pushDecimalToCurrentNumber() {
  currentNumber += ".";
  updateDisplayNumber();
}