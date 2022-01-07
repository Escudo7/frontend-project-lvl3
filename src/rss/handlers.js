import validate from './validation';

export const inputHandler = (e, state) => {
  state.form.value = e.target.value;
};

export const submitHandler = (e, state) => {
  e.preventDefault();
  validate(e, state);
};
