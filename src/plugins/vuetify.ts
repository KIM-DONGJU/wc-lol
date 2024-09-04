/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import styles from '@/styles/_export.module.scss';

// Composables
import { createVuetify } from 'vuetify';

const customColor = {
  primary: styles.primary,
  error: styles.error,
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          ...customColor,
        },
      },
    },
  },
});
