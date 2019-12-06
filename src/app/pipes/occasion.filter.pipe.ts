import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'occasionFilter'
})

export class OccasionFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        // console.log(items);

        searchText = searchText.toLowerCase();

        return items.filter( it => {
            return it['occasion_name'].toLowerCase().includes(searchText);
        });
    }
}