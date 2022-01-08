import onChange from 'on-change';
import i18next from 'i18next';
import render from './renderer.js';
import selectors from './selectors';
import { inputHandler, submitHandler } from './handlers.js';
import ru from './lang/ru';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: { ru },
  });

  const initState = {
    rssList: [],
    postList: [],
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
    form.addEventListener('submit', (e) => submitHandler(e, state, i18nextInstance));
  }
};
