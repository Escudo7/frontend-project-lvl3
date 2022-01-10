import onChange from 'on-change';
import i18next from 'i18next';
import render from './renderer.js';
import selectors from './selectors';
import {
  inputHandler, submitHandler, postsLoader, modalCloseHandler,
} from './handlers.js';
import ru from './lang/ru';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
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
    uiState: {
      viewedPosts: [],
      viewingPost: null,
    },
  };
  const state = onChange(initState, (path, value) => {
    render(path, value, i18nextInstance, state);
  });

  const inputRss = document.querySelector(selectors.rssAddInput);
  if (inputRss) {
    inputRss.addEventListener('change', (e) => inputHandler(e, state));
  }

  const form = document.querySelector(selectors.rssForm);
  if (form) {
    form.addEventListener('submit', (e) => submitHandler(e, state, i18nextInstance));
  }

  const modalCloseBtns = document.querySelectorAll(selectors.modalCloseBtn);
  modalCloseBtns.forEach((modalCloseBtn) => {
    modalCloseBtn.addEventListener('click', () => modalCloseHandler(state));
  });

  const postsLoadTimeout = 5000;
  document.addEventListener('DOMContentLoaded', () => postsLoader(state, postsLoadTimeout));
};
