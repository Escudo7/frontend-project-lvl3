import { inputHandler, submitHandler } from './handlers.js';

export default (state) => {
  const form = document.querySelector('form[data-place=form-rss]');
  if (!form) {
    return;
  }

  const newForm = document.createElement('form');
  newForm.dataset.place = 'form-rss';

  const row = document.createElement('div');
  row.classList.add('row');

  const colInput = document.createElement('div');
  colInput.classList.add('col', 'col-9');
  const inputGroup = document.createElement('div');
  const input = document.createElement('input');
  input.classList.add('form-control');
  input.value = state.form.value;
  input.type = 'text';
  input.name = 'add-rss';
  input.placeholder = 'ссылка RSS';
  input.required = true;
  input.autoFocus = true;
  input.addEventListener('change', (e) => inputHandler(e, state));

  if (state.form.valid === false) {
    input.classList.add('is-invalid');
  }

  inputGroup.append(input);

  if (state.form.error !== null) {
    const validFeedback = document.createElement('div');
    validFeedback.classList.add('invalid-feedback');
    validFeedback.textContent = state.form.error;
    inputGroup.append(validFeedback);
  }

  colInput.append(inputGroup);

  const colBtn = document.createElement('div');
  colBtn.classList.add('col');
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.classList.add('btn', 'btn-primary');
  btn.textContent = 'Добавить';
  colBtn.append(btn);

  row.append(colInput, colBtn);
  newForm.append(row);
  newForm.addEventListener('submit', (e) => submitHandler(e, state));

  form.parentNode.replaceChild(newForm, form);
  input.focus();
};
