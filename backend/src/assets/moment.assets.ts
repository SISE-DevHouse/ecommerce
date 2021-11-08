import * as moment from 'moment';

//momentTimezone().tz("Africa/Abidjan").format();

// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function GetDate(): any {

    // lo desencripto
    return moment().format();
}


// Convierte el formato de fecha.
export function ConvertMMDDYYYToYYYYMMDD(dateMMDDYYY: any): Date {

    let date = moment(dateMMDDYYY, "MM/DD/YYYY");

    return new Date(date.format("YYYY/MM/DD"));

}