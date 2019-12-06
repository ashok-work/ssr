import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderDirective } from './image-slider.directive';
import { MapComponent } from './map-directive/map-directive.component';
import { PlacesAutoCompleteDirective } from './places-auto-complete/places-auto-complete.directive';

@NgModule({
  declarations: [
    ImageSliderDirective,
    MapComponent,
    PlacesAutoCompleteDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageSliderDirective,
    MapComponent,
    PlacesAutoCompleteDirective,
  ]
})
export class CustomDirectivesModule { }
