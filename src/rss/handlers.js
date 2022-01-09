import axios from 'axios';
import _ from 'lodash';
import validate from './validation.js';
import parse from './parser.js';

const getProxyLinkPref = () => 'https://hexlet-allorigins.herokuapp.com/get?url=';

export const inputHandler = (e, state) => {
  state.form.value = e.target.value;
};

export const submitHandler = (event, state, i18next) => {
  event.preventDefault();
  validate(event, state.rssList, i18next)
    .then((link) => axios.get(getProxyLinkPref() + encodeURIComponent(link)))
    .then(({ data }) => {
      const { status, contents } = data;

      if (_.has(status, 'error') || contents === null) {
        state.form.valid = false;
        state.form.error = i18next.t('error.notValidRss');

        return;
      }

      try {
        const dataParsed = parse(contents);
        const feed = { ...dataParsed.feed, link: status.url };

        state.form.valid = true;
        state.form.value = '';
        state.form.error = null;
        state.rssList.push(feed);
        state.postList.push(...dataParsed.posts);
      } catch (e) {
        state.form.valid = false;
        state.form.error = i18next.t('error.notValidRss');
      }
    })
    .catch((exception) => {
      state.form.valid = false;
      state.form.error = exception.message;
    });
};
