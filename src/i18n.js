import i18next from 'i18next';
import { fr } from './locales/fr.locale';
import { en } from './locales/en.locale';


i18next
  .init({
    interpolation: {
      escapeValue: false,
    },
    lng: 'fr',
    resources: {
      fr,
      en
    },
  })

export default i18next