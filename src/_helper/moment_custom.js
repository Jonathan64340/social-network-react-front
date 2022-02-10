import moment from 'moment';
import 'moment/locale/fr';
import i18n from '../i18n';

const momentCustom = ({ date, locale = i18n.language, format = 'DD/MM/YYYY HH:mm', fromNowDisplay = false }) => {
    moment.locale(locale);
    let latest = moment(date);

    if (date > new Date().getTime() - 60 * 60 * 24 * 1000 && fromNowDisplay) {
        return latest.fromNow();
    }

    return latest.format(format);
}

export { momentCustom };