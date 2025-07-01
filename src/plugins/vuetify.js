import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          main: '#03c9d7',
          accent: '#018a94',
          dark: '#11142D',
          surface: '#f6f6f6',
          side: '#ffffff',
          'on-surface': '#11142D',
        },
      },
      dark: {
        dark: true,
        colors: {
          main: '#03c9d7',
          accent: '#018a94',
          dark: '#11142D',
          surface: '#f6f6f6',
          side: '#00000',
        },
      },
    },
  },
});
export default vuetify;
