import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appImageSlider]'
})
export class ImageSliderDirective {

  constructor(el: ElementRef) {
    const nativeRef = el.nativeElement;
    console.log(el.nativeElement);
    console.log(nativeRef.hasChildNodes());
  }

}
