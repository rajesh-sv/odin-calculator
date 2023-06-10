const DEFAULT_DISPLAY_NUMBER = "0";
const expressionItemArr = [];
const operate = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  "^": (a, b) => a ** b,
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
    if (expressionItemArr.length && getLastArrayItem(expressionItemArr) === ')') {
      pushOperatorToExpression(operator);
    }
    else {
      pushCurrentNumberToExpression();
      pushOperatorToExpression(operator);
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
  if (currentNumber[currentNumber.length - 1] === ".") {
    setDecimalAvailable();
  }
  currentNumber = currentNumber.slice(0, currentNumber.length - 1);
  if (!currentNumber.length)
    currentNumber = DEFAULT_DISPLAY_NUMBER;
  updateDisplayNumber();
});

openBracket.addEventListener('click', () => {
  const lastExpressionItem = getLastArrayItem(expressionItemArr);
  if (!expressionItemArr.length || isOperator(lastExpressionItem) || lastExpressionItem === "(") {
    ++closeBracketAllowedCount;
    pushBracketToExpression("(");
  }
});

closeBracket.addEventListener('click', () => {
  if (closeBracketAllowedCount) {
    if (expressionItemArr[expressionItemArr.length - 1] !== ")")
      pushCurrentNumberToExpression();
    pushBracketToExpression(")");
    --closeBracketAllowedCount;
  }
});

decimalButton.addEventListener('click', () => {
  if (!decimalUsed) {
    setDecimalUnavailable();
    pushDecimalToCurrentNumber();
  }
});

equalToButton.addEventListener('click', () => {
  if (!expressionItemArr.length || isOperator(getLastArrayItem(expressionItemArr)))
    pushCurrentNumberToExpression();
  while (closeBracketAllowedCount--) {
    pushBracketToExpression(")");
  }
  expressionItemArr.unshift("(")
  expressionItemArr.push(")")
  currentNumber = evaluateMathExpression()
  updateDisplayNumber();
});

function initialize() {
  setDecimalAvailable();
  currentNumber = DEFAULT_DISPLAY_NUMBER;
  mathExpression = "";
  expressionItemArr.length = 0;
  closeBracketAllowedCount = 0;
  updateDisplay();
}

function updateDisplay() {
  updateDisplayNumber();
  updateDisplayExpression();
}

function updateDisplayNumber() {
  numberDisplay.textContent = currentNumber;
}

function updateDisplayExpression() {
  expressionDisplay.textContent = mathExpression;
}

function getLastArrayItem(arr) {
  return arr[arr.length - 1];
}

function isOperator(operator) {
  return operator in operate;
}

function pushCurrentNumberToExpression() {
  mathExpression += currentNumber;
  expressionItemArr.push(Number(currentNumber));
  currentNumber = DEFAULT_DISPLAY_NUMBER;
  setDecimalAvailable();
  updateDisplay();
}

function pushOperatorToExpression(operator) {
  mathExpression += operator;
  expressionItemArr.push(operator);
  updateDisplay();
}

function pushBracketToExpression(bracket) {
  mathExpression += bracket;
  expressionItemArr.push(bracket);
  updateDisplayExpression();
}

function popPushOperatorToExpression(operator) {
  mathExpression = mathExpression.slice(0, mathExpression.length - 1) + operator;
  expressionItemArr.pop();
  expressionItemArr.push(operator);
  updateDisplay();
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

function setDecimalUnavailable() {
  decimalUsed = true;
  decimalButton.classList.add('greyed');
}

function setDecimalAvailable() {
  decimalUsed = false;
  decimalButton.classList.remove('greyed');
}

function evaluateMathExpression() {
  const stack = [];
  for (const item of expressionItemArr) {
    if (item === ")") {
      const simpleExpression = [];
      while (getLastArrayItem(stack) !== "(")
        simpleExpression.push(stack.pop());
      simpleExpression.reverse();
      console.log(simpleExpression);
      stack.pop();
      stack.push(evaluateSimpleExpression(simpleExpression)[0]);
    } else {
      stack.push(item);
    }
  }
  return Math.round(stack[0] * 100) / 100;
}

function evaluateSimpleExpression(simpleExpression) {
  simpleExpression = evaluatePrecedenceOneOperators(simpleExpression); // ^ (Power)
  console.log(simpleExpression);
  simpleExpression = evaluatePrecedenceTwoOperators(simpleExpression); // * (Multiply), / (Divide), % (Modulus)
  console.log(simpleExpression);
  simpleExpression = evaluatePrecedenceThreeOperators(simpleExpression); // + (Add), - (Subtract)
  return simpleExpression;
}

function evaluatePrecedenceOneOperators(simpleExpression) {
  return evaluateOperators(simpleExpression, ["^"]);
}

function evaluatePrecedenceTwoOperators(simpleExpression) {
  return evaluateOperators(simpleExpression, ["*", "/", "%"]);
}

function evaluatePrecedenceThreeOperators(simpleExpression) {
  return evaluateOperators(simpleExpression, ["+", "-"]);
}

function evaluateOperators(simpleExpression, operatorsList) {
  const newExpression = [];
  for (let i = 0; i < simpleExpression.length; ++i) {
    if (operatorsList.includes(simpleExpression[i])) {
      a = newExpression.pop();
      b = simpleExpression[i + 1];
      newExpression.push(operate[simpleExpression[i]](a, b));
      ++i;
    } else {
      newExpression.push(simpleExpression[i]);
    }
  }
  return newExpression;
}