import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { environment } from '../../environments/environment';

@Pipe({
    name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {

    transform(phone: any, country_code?: any): any {
        let carrier_code: any = environment.country_code.toUpperCase();
        if (country_code) {
            carrier_code = country_code.toUpperCase();
        }
        const phoneNumber = parsePhoneNumberFromString(`Phone: ${phone}`, carrier_code);
        console.log('phoneNumber', phoneNumber);
        return phoneNumber.formatInternational();
    }
}
