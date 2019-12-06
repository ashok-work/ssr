import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'eventTypeFilter'
})

export class EventTypeFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        // console.log(items);

        searchText = searchText.toLowerCase();

        return items.filter( it => {
            return it['type_name'].toLowerCase().includes(searchText);
        });
    }
}