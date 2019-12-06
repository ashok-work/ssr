import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';
declare const google: any;

@Directive({
  selector: '[placesAutoComplete]'
})
export class PlacesAutoCompleteDirective {

  @Output() addressChange = new EventEmitter();

  constructor(private el: ElementRef) {
    try {
      var options = {
        types: [],
        componentRestrictions: { country: ['us', "in"] }
      };
      let autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, options);
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this.addressChange.emit(autocomplete.getPlace());
      });
    } catch (error) {
      console.error(error);
    }
  }

}
