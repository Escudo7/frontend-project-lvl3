import onChange from 'on-change';
import render from './renderer.js';
import { inputHandler, submitHandler } from './handlers.js';

const selectors = {
  rssForm: 'form[data-place=form-rss]',
  rssAddInput: 'input[name=add-rss]',
};

export default () => {
  const initState = {
    rssList: [],
    form: {
      valid: true,
      value: '',
      error: null,
    },
  };
  const state = onChange(initState, (path) => {
    switch (path) {
      case 'rssList':
      case 'form.valid':
      case 'form.error':
        render(state);
        break;
      default:
        break;
    }
  });

  const inputRss = document.querySelector(selectors.rssAddInput);
  if (inputRss) {
    inputRss.addEventListener('change', (e) => inputHandler(e, state));
  }

  const form = document.querySelector(selectors.rssForm);
  if (form) {
    form.addEventListener('submit', (e) => submitHandler(e, state));
  }
};
