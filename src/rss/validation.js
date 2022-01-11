import { string, setLocale } from 'yup';

export default (e, rssList, i18next) => {
  setLocale({
    mixed: {
      required: i18next.t('messages.required'),
    },
    string: {
      url: i18next.t('messages.notValidUrl'),
    },
  });
  const rssSchema = string()
    .lowercase()
    .required()
    .trim()
    .url()
    .test('unique', i18next.t('messages.rssExists'), (value) => !rssList.find((rss) => rss.link === value));
  const formData = new FormData(e.target);

  return rssSchema.validate(formData.get('url'));
};
