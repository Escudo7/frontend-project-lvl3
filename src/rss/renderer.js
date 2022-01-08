import selectors from './selectors';

const renderInput = (isValid) => {
  const input = document.querySelector(selectors.rssAddInput);
  if (!input) {
    return;
  }

  if (isValid) {
    input.classList.remove('is-invalid');

    return;
  }

  input.classList.add('is-invalid');
  input.focus();
};

const renderInvalidMessage = (message) => {
  const invalidFeedback = document.querySelector(selectors.invalidFeedback);
  if (!invalidFeedback) {
    return;
  }

  if (message === null) {
    invalidFeedback.textContent = '';

    return;
  }

  invalidFeedback.textContent = message;
};

const clearForm = () => {
  const input = document.querySelector(selectors.rssAddInput);
  input.value = '';
  input.focus();
};

export default (path, value) => {
  switch (path) {
    case 'rssList':
      clearForm();
      break;

    case 'form.valid':
      renderInput(value);
      break;

    case 'form.error':
      renderInvalidMessage(value);
      break;

    default:
      break;
  }
};
