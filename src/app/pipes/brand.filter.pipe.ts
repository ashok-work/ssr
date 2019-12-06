import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'brandFilter'
})

export class BrandFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        // console.log(items);

        searchText = searchText.toLowerCase();

        return items.filter( it => {
            return it['brand_name'].toLowerCase().includes(searchText);
        });
    }
}