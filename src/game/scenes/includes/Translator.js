import fr from '../../../translations/translations.fr.json';
import en from '../../../translations/translations.en.json';
import es from '../../../translations/translations.es.json';
import it from '../../../translations/translations.it.json';
import ca from '../../../translations/translations.ca.json';
import de from '../../../translations/translations.de.json';

export default class Translator {
    constructor(lang) {
        this.lang = lang.toLowerCase();
        this.translations = this.loadTranslations();

        window.setLanguage = (lang) => {
            this.lang = lang.toLowerCase();
            this.translations = this.loadTranslations();

            return lang;
        };
    }

    loadTranslations() {
        switch (this.lang) {
            case 'fr':
                return fr;
            case 'en':
                return en;
            case 'es':
                return es;
            case 'it':
                return it;
            case 'ca':
                return ca;
            case 'de':
                return de;
            default:
                return en;
        }
    }

    translate(key) {
        const translation = this.translations[key];
        if (translation) {
            return translation;
        } else {
            return key;
        }
    }
}