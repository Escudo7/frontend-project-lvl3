import { string, setLocale } from 'yup';

export default (e, state, i18next) => {
  setLocale({
    mixed: {
      required: i18next.t('errorRssRequired'),
    },
    string: {
      url: i18next.t('errorRssValidUrl'),
    },
  });
  const rssSchema = string()
    .lowercase()
    .required()
    .trim()
    .url()
    .test('unique', i18next.t('errorRssExists'), (value) => !state.rssList.includes(value));
  const formData = new FormData(e.target);
  rssSchema.validate(formData.get('add-rss'))
    .then((rss) => {
      state.form.valid = true;
      state.form.value = '';
      state.form.error = null;
      state.rssList.push(rss);
    })
    .catch((exception) => {
      state.form.valid = false;
      state.form.error = exception.message;
    });
};
