/**
 * @providesModule DateUtilService
 */

import moment from 'moment';
import 'moment/locale/ko';

/*
* @params  {string} fmt
* @params  {timestamp} date
* @returns {string} date
*/
export const format = ( fmt, date ) => {
    moment.locale( 'ko' );
    switch (fmt) {
        case 'llll':
            return moment( date ).format('llll');
        case 'll':
            return moment( date ).format('ll');
        case 'LT':
            return moment( date ).format('LT');
        case 'fromNow':
            return moment( date ).fromNow();
        case 'point':
            return moment( date ).format('YYYY.MM.DD');
        case 'number':
            return moment( date ).format('YYMMDD');
        case 'dash':
            return moment( date ).format('YYYY-MM-DD');
        default:
            return moment( date ).format('llll');
    }
}

export const getCurrentTimeStamp = ( date ) => {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let photoDate = new Date(date);
    return new Date(photoDate.getTime() - tzoffset).toISOString();
}

export const getLeftDays = ( date ) => {
    let endAt = moment(date);
    let today = moment().format('YYYY-MM-DD');

    let leftDays = endAt.diff(today, 'days');

    return leftDays > 0 ? leftDays : 0;
}
export const getLeftDaysAhead = ( date ) => {
    let endAt = moment(date);
    let today = moment().format('YYYY-MM-DD');
    console.log('console.log(endAt);');
    console.log(date);
    console.log(endAt);
    console.log(today);
    let leftDays = today.diff(endAt, 'days');

    return leftDays > 0 ? leftDays : 0;
}
export const countDays = ( date ) => {
    let createdAt = moment(date);

    return moment().diff(createdAt, 'day');
}