'use strict';

// ── Config ────────────────────────────────────────────────────
const CREDENTIALS = { username: 'mylogin', password: 'login123' };

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

  // Simulate network delay
  setTimeout(() => {
    const enteredUser = uInput.value.trim();
    const enteredPass = pInput.value;

    // FIXED: Case-insensitive comparison
    if (
      enteredUser.toLowerCase() === CREDENTIALS.username.toLowerCase() &&
      enteredPass === CREDENTIALS.password
    ) {
      successName.textContent = `Welcome back, ${enteredUser}!`;
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