import { string } from 'yup';

export default (e, state) => {
  const rssSchema = string()
    .lowercase()
    .required()
    .trim()
    .url()
    .test('unique', 'этот RSS уже был добавлен ранее', (value) => !state.rssList.includes(value));
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
