const valEl  = document.getElementById('val');
  const exprEl = document.getElementById('expr');

  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': 'mod', '^': '^' };

  const calc = {
    current : '0',
    prev    : null,
    operator: null,
    fresh   : true,   // next digit starts a new number

    /* ── Render ──────────────────────────────────────────── */
    render() {
      valEl.textContent = this.current;
      valEl.className   = 'display-val' + (this.current === 'Error' ? ' error' : '');
      exprEl.textContent = (this.prev !== null && this.operator)
        ? this.prev + ' ' + (opSymbols[this.operator] || this.operator)
        : '';
    },

    /* ── Digit input ─────────────────────────────────────── */
    digit(d) {
      if (this.fresh || this.current === '0') {
        this.current = d;
        this.fresh   = false;
      } else {
        if (this.current.length >= 14) return;
        this.current += d;
      }
      this.render();
    },

    /* ── Decimal point ───────────────────────────────────── */
    dot() {
      if (this.fresh)                      { this.current = '0.'; this.fresh = false; }
      else if (!this.current.includes('.')) { this.current += '.'; }
      this.render();
    },

    /* ── Operator ────────────────────────────────────────── */
    op(o) {
      if (this.current === 'Error') return;
      // Chain: evaluate pending operation first
      if (this.prev !== null && this.operator && !this.fresh) {
        this.current = this._compute(
          parseFloat(this.prev), parseFloat(this.current), this.operator
        );
      }
      this.prev     = this.current;
      this.operator = o;
      this.fresh    = true;
      this.render();
    },

    /* ── Equals ──────────────────────────────────────────── */
    equals() {
      if (this.prev === null || this.operator === null) return;
      const result = this._compute(
        parseFloat(this.prev), parseFloat(this.current), this.operator
      );
      this.prev     = null;
      this.operator = null;
      this.current  = result;
      this.fresh    = true;
      this.render();
    },

    /* ── Core arithmetic ─────────────────────────────────── */
    _compute(a, b, op) {
      let r;
      switch (op) {
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        case '/': if (b === 0) return 'Error'; r = a / b; break;
        case '%': if (b === 0) return 'Error'; r = a % b; break;
        case '^': r = Math.pow(a, b); break;
        default : return 'Error';
      }
      // Trim floating-point noise (e.g. 0.1 + 0.2 = 0.30000000000000004)
      return parseFloat(r.toPrecision(12)).toString();
    },

    /* ── Clear ───────────────────────────────────────────── */
    clear() {
      this.current  = '0';
      this.prev     = null;
      this.operator = null;
      this.fresh    = true;
      this.render();
    },

    /* ── Toggle sign ─────────────────────────────────────── */
    toggleSign() {
      if (this.current === '0' || this.current === 'Error') return;
      this.current = this.current.startsWith('-')
        ? this.current.slice(1)
        : '-' + this.current;
      this.render();
    }
  };

  /* ── Keyboard support ──────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if ('0123456789'.includes(e.key))          calc.digit(e.key);
    else if (e.key === '.')                    calc.dot();
    else if (['+','-','*','/','%','^'].includes(e.key)) calc.op(e.key);
    else if (e.key === 'Enter' || e.key === '=')        calc.equals();
    else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') calc.clear();
    else if (e.key === 'Backspace') {
      if (calc.current.length > 1 && calc.current !== 'Error') {
        calc.current = calc.current.slice(0, -1);
        calc.render();
      } else {
        calc.clear();
      }
    }
  });

'use strict';

// ── Config ────────────────────────────────────────────────────
const CREDENTIALS = { username: 'OPAWALE', password: 'OPAWALE123' };

// ── DOM ───────────────────────────────────────────────────────
const form          = document.getElementById('form');
const uInput        = document.getElementById('username');
const pInput        = document.getElementById('password');
const uErr          = document.getElementById('u-err');
const pErr          = document.getElementById('p-err');
const alert         = document.getElementById('alert');
const alertText     = document.getElementById('alert-text');
const btnSubmit     = document.getElementById('btn-submit');
const btnLabel      = document.getElementById('btn-label');
const btnSpinner    = document.getElementById('btn-spinner');
const btnReset      = document.getElementById('btn-reset');
const togglePw      = document.getElementById('toggle-pw');
const eye           = document.getElementById('eye');
const successScreen = document.getElementById('success-screen');
const successName   = document.getElementById('success-name');

const fieldU = document.getElementById('field-u');
const fieldP = document.getElementById('field-p');

// ── Validation ────────────────────────────────────────────────
function validateUsername(val) {
  if (!val.trim())            return 'Username is required.';
  if (val.trim().length < 3)  return 'Must be at least 3 characters.';
  if (val.trim().length > 50) return 'Must be under 50 characters.';
  return null;
}

function validatePassword(val) {
  if (!val)           return 'Password is required.';
  if (val.length < 4) return 'Must be at least 4 characters.';
  return null;
}

function setField(fieldEl, errEl, input, state, msg) {
  fieldEl.classList.remove('is-valid', 'is-invalid');
  if (state) fieldEl.classList.add(state);
  errEl.textContent = msg || '';
}

// ── Real-time validation ──────────────────────────────────────
uInput.addEventListener('blur', () => {
  const e = validateUsername(uInput.value);
  setField(fieldU, uErr, uInput, e ? 'is-invalid' : 'is-valid', e);
});

uInput.addEventListener('input', () => {
  if (fieldU.classList.contains('is-invalid')) {
    const e = validateUsername(uInput.value);
    setField(fieldU, uErr, uInput, e ? 'is-invalid' : 'is-valid', e);
  }
});

pInput.addEventListener('blur', () => {
  const e = validatePassword(pInput.value);
  setField(fieldP, pErr, pInput, e ? 'is-invalid' : 'is-valid', e);
});

pInput.addEventListener('input', () => {
  if (fieldP.classList.contains('is-invalid')) {
    const e = validatePassword(pInput.value);
    setField(fieldP, pErr, pInput, e ? 'is-invalid' : 'is-valid', e);
  }
});

// ── Alert ─────────────────────────────────────────────────────
function showAlert(msg, type) {
  alert.hidden = false;
  alert.className = `alert is-${type}`;
  alertText.textContent = msg;
}
function hideAlert() { alert.hidden = true; }

// ── Loading state ─────────────────────────────────────────────
function setLoading(on) {
  btnSubmit.disabled = on;
  btnReset.disabled  = on;
  btnLabel.hidden    = on;
  btnSpinner.hidden  = !on;
}

// ── Password toggle ───────────────────────────────────────────
const EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
const EYE_OFF  = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;

togglePw.addEventListener('click', () => {
  const show = pInput.type === 'password';
  pInput.type = show ? 'text' : 'password';
  eye.innerHTML = show ? EYE_OFF : EYE_OPEN;
  togglePw.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

// ── Submit ────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();
  hideAlert();

  const uErrMsg = validateUsername(uInput.value);
  const pErrMsg = validatePassword(pInput.value);
  setField(fieldU, uErr, uInput, uErrMsg ? 'is-invalid' : 'is-valid', uErrMsg);
  setField(fieldP, pErr, pInput, pErrMsg ? 'is-invalid' : 'is-valid', pErrMsg);

  if (uErrMsg || pErrMsg) {
    if (uErrMsg) uInput.focus();
    else pInput.focus();
    return;
  }

  setLoading(true);

  // Simulate network delay (remove if connecting to a real backend)
  setTimeout(() => {
    const enteredUser = uInput.value.trim();
    const enteredPass = pInput.value;

    if (
      enteredUser.toUpperCase() === CREDENTIALS.username &&
      enteredPass === CREDENTIALS.password
    ) {
      successName.textContent = `Welcome back, ${enteredUser.toUpperCase()}!`;
      successScreen.hidden = false;
      document.body.style.overflow = 'hidden';
    } else {
      showAlert('Incorrect username or password. Please try again.', 'error');
      setField(fieldU, uErr, uInput, 'is-invalid', '');
      setField(fieldP, pErr, pInput, 'is-invalid', '');
      pInput.value = '';
      pInput.focus();
    }

    setLoading(false);
  }, 700);
});

// ── Reset ─────────────────────────────────────────────────────
form.addEventListener('reset', () => {
  setField(fieldU, uErr, uInput, null, '');
  setField(fieldP, pErr, pInput, null, '');
  hideAlert();
});

// ── Go back from success ──────────────────────────────────────
function goBack() {
  successScreen.hidden = true;
  document.body.style.overflow = '';
  form.reset();
  uInput.focus();
}

// ── Focus on load ─────────────────────────────────────────────
uInput.focus();

