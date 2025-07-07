import { Form, Field } from 'vee-validate';

export default {
  install(app) {
    app.component('Form', Form);
    app.component('Field', Field);
  },
};
