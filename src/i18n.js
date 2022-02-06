import i18next from 'i18next';
import { fr } from './locales/fr.locale';

i18next
  .init({
    interpolation: {
      escapeValue: false,
    },
    lng: 'fr',
    resources: {
      fr
    },
  })

export default i18next