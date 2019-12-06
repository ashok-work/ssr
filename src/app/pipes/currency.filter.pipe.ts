import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
    name: 'currencyFilter'
})

export class CurrencyFilterPipe implements PipeTransform {
    transform(value) {
        return (environment.currency + '' + value);
    }
}