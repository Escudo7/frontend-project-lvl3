import onChange from 'on-change';
import render from './renderer.js';
import selectors from './selectors';
import { inputHandler, submitHandler } from './handlers.js';

export default () => {
  const initState = {
    rssList: [],
    form: {
      valid: true,
      value: '',
      error: null,
    },
  };
  const state = onChange(initState, (path, value) => {
    render(path, value);
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
