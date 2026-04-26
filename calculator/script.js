let expression = '';
lecexpressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

// ── Append digit or operator ──
function appendToExpression(value) {
  // If a result was just shown and user types a number, start fresh
  if (freshResult) {
    if (!isNaN(value) || value === '.') {
      expression = '';
    }
    freshResult = false;
  }

  expression += value;
  updateDisplay();
}

// ── Clear everything ──
function clearAll() {
  expression = '';
  freshResult = false;
  resultEl.textContent = '0';
  resultEl.classList.remove('error');
  expressionEl.textContent = '';
}

// ── Delete last character ──
function deleteLast() {
  if (freshResult) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  updateDisplay();
}

// ── Calculate result ──
function calculate() {
  if (expression === '') return;

  try {
    // Replace display symbols with JS operators
    let evalExpr = expression
      .replace(/÷/g, '/')
      .replace(/×/g, '*');

    // Evaluate safely
    let result = Function('"use strict"; return (' + evalExpr + ')')();

    // Handle division by zero
    if (!isFinite(result)) {
      showError('Cannot divide by 0');
      return;
    }

    // Round to avoid floating point noise
    result = parseFloat(result.toFixed(10));

    expressionEl.textContent = expression + ' =';
    resultEl.textContent = result;
    resultEl.classList.remove('error');

    expression = String(result);
    freshResult = true;

  } catch (e) {
    showError('Invalid Expression');
  }
}

// ── Update screen ──
function updateDisplay() {
  resultEl.classList.remove('error');

  if (expression === '') {
    resultEl.textContent = '0';
    expressionEl.textContent = '';
    return;
  }

  expressionEl.textContent = expression;

  // Live preview of result
  try {
    let evalExpr = expression.replace(/÷/g, '/').replace(/×/g, '*');
    let preview = Function('"use strict"; return (' + evalExpr + ')')();
    if (isFinite(preview) && !isNaN(preview)) {
      resultEl.textContent = parseFloat(preview.toFixed(10));
    }
  } catch (e) {
    // Not a complete expression yet — keep last valid display
  }
}

// ── Show error ──
function showError(msg) {
  resultEl.textContent = msg;
  resultEl.classList.add('error');
  expression = '';
  freshResult = false;
  expressionEl.textContent = '';
}

// ── Keyboard Support ──
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key >= '0' && key <= '9') appendToExpression(key);
  else if (key === '.') appendToExpression('.');
  else if (key === '+') appendToExpression('+');
  else if (key === '-') appendToExpression('-');
  else if (key === '*') appendToExpression('*');
  else if (key === '/') { e.preventDefault(); appendToExpression('/'); }
  else if (key === '%') appendToExpression('%');
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Backspace') deleteLast();
  else if (key === 'Escape') clearAll();
});