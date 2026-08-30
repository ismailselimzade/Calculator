"use strict";

// change theme
const ball = document.querySelector(".ball");

const moveBall = () => {
  ball.classList.toggle("light");
  document.body.classList.toggle("night-mode");
};
ball.addEventListener("click", moveBall);

// calculator

const input = document.querySelector("#input");
const result = document.querySelector("#result");
const keys = document.querySelector(".calculator-keys");

let inputValue = null;
let resultValue = "0";
let operator = null;
let waitingForSecondValue = false;
let history = "";

updateResult();
function updateResult() {
  result.value = resultValue;
}

keys.addEventListener("click", function (e) {
  const element = e.target.closest("button");
  if (!element) return;

  const evalue = element.value;

  switch (evalue) {
    case "+":
    case "-":
    case "*":
    case "/":
    case "%":
      handleOperator(evalue);
      break;
    case "=":
      handleEqual();
      break;
    case ".":
      inputDecimal();
      break;
    case "clear":
      clear();
      break;
    default:
      inputNumber(evalue);
      break;
    case "delete":
      delChar();
      break;
    case "negative":
      negative();
      break;
  }

  updateResult();
});

function handleOperator(nextOperator) {
  const value = parseFloat(resultValue);

  if (operator && waitingForSecondValue) {
    if (/[+\-*/%]\s*$/.test(history)) {
      history = history.replace(/[+\-*/%]\s*$/, `${nextOperator} `);
    } else {
      history += ` ${nextOperator} `;
    }
    operator = nextOperator;
    input.value = history;
    return;
  }

  if (inputValue === null) {
    inputValue = value;
    history = `${value} ${nextOperator} `;
  } else if (operator) {
    const calc = calculate(inputValue, value, operator);
    if (calc === null) return;
    resultValue = `${parseFloat(calc.toFixed(7))}`;
    history += `${value} ${nextOperator} `;
    inputValue = calc;
  }

  waitingForSecondValue = true;
  operator = nextOperator;
  input.value = history;
}

function handleEqual() {
  if (!operator || inputValue === null) return;

  const value = parseFloat(resultValue);
  const calc = calculate(inputValue, value, operator);
  if (calc === null) return;

  history += `${value}`;
  input.value = history;
  resultValue = `${parseFloat(calc.toFixed(7))}`;
  inputValue = calc;
  waitingForSecondValue = true;
}

function calculate(first, second, operator) {
  if (operator === "+") {
    return first + second;
  } else if (operator === "-") {
    return first - second;
  } else if (operator === "*") {
    return first * second;
  } else if (operator === "/") {
    if (second === 0) return null;
    return first / second;
  } else if (operator === "%") {
    return first % second;
  }
  return second;
}

function inputNumber(num) {
  if (waitingForSecondValue) {
    resultValue = num;
    waitingForSecondValue = false;
  } else {
    resultValue = resultValue === "0" ? num : resultValue + num;
  }
  if (operator) {
    input.value = history + resultValue;
  }
}

function inputDecimal() {
  if (waitingForSecondValue) {
    resultValue = "0.";
    waitingForSecondValue = false;
    return;
  }
  if (!resultValue.includes(".")) {
    resultValue += ".";
  }
}

function clear() {
  resultValue = "0";
  inputValue = null;
  operator = null;
  waitingForSecondValue = false;
  history = "";
  input.value = null;
}

function delChar() {
  if (resultValue.length > 1) resultValue = resultValue.slice(0, -1);
  else resultValue = "0";
}

function negative() {
  if (resultValue !== "0") {
    resultValue = `${parseFloat(resultValue) * -1}`;
  }
}
