import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { colorThemes } from '../custom-theme/color';

const savedTheme = localStorage.getItem('selectedTheme') || 'light';
const savedColor = localStorage.getItem('selectedColor') || 'teal';

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
    defaultTheme: savedTheme,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colorThemes[savedColor].light,
          secondary: '#018a94',
          background: '#f6f6f6',
          surface: '#ffffff',
          dark: '#11142D',
          'on-surface': '#11142D',
          error: '#B00020',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: colorThemes[savedColor].dark,
          secondary: '#016a74',
          background: '#f6f6f6',
          dark: '#11142D',
          surface: '#010724',
          'on-surface': '#FFFFFF',
          error: '#B00020',
        },
      },
    },
  },
});

export default vuetify;
