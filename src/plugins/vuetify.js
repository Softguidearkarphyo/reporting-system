import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { colorThemes } from '../custom-theme/color';
import { tablerIcon } from '../plugins/tablerIcon.js';

const savedTheme = localStorage.getItem('selectedTheme') || 'light';
const savedColor = localStorage.getItem('selectedColor') || 'limeGreen';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      tabler: tablerIcon,
    },
  },
  theme: {
    defaultTheme: savedTheme,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colorThemes[savedColor].light,
          secondary: colorThemes[savedColor].secondaryLight,
          background: '#f6f6f6',
          surface: '#FFFFFF',
          font: '#070707ff',
          login: 'e3f2fd',
          dark: '#11142D',
          'on-surface': '#070707ff',
          error: '#B00020',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: colorThemes[savedColor].dark,
          secondary: colorThemes[savedColor].secondaryDark,
          background: '#0a0e24',
          dark: '#11142D',
          font: '#ffffff',
          login: 'e3f2fd',
          surface: '#010724',
          'on-surface': '#FFFFFF',
          error: '#B00020',
        },
      },
    },
  },
});

export default vuetify;
