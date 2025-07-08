import { Form, Field, configure } from 'vee-validate';

export default {
  install(app) {
    app.component('Form', Form);
    app.component('Field', Field);
    configure({
      validateOnBlur: false,
      validateOnChange: false,
      validateOnInput: false,
      validateOnModelUpdate: false,
    });
  },
};
