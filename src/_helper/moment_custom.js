import moment from 'moment';
import 'moment/locale/fr';
import i18n from '../i18n';

const momentCustom = ({ date, locale = i18n.language, format = 'DD/MM/YYYY HH:mm', fromNowDisplay = false }) => {
    moment.locale(locale);
    let _moment = moment(date);
    let _date = new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getTime();

    if (date < _date && fromNowDisplay) {
        return _moment.fromNow();
    }

    return _moment.format(format);
}

export { momentCustom };