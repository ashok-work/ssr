import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandFilterPipe } from './brand.filter.pipe';
import { CurrencyFilterPipe } from './currency.filter.pipe';
import { EventDatePipe } from './event-date.pipe';
import { EventTypeFilterPipe } from './event.type.filter.pipe';
import { ImagesPipe } from './images.pipe';
import { OccasionFilterPipe } from './occasion.filter.pipe';
import { PhoneFormatPipe } from './phone-format.pipe';
import { EventHostPipe } from './event-host.pipe';
import { EventImagePipe } from './event-image.pipe';
import { UserImagePipe } from './user-image.pipe';
import { CeilPipe } from './ceil.pipe';
import { ArrayBuilderPipe } from './array-builder.pipe';

@NgModule({
  declarations: [
    ArrayBuilderPipe,
    BrandFilterPipe,
    CeilPipe,
    CurrencyFilterPipe,
    EventDatePipe,
    EventHostPipe,
    EventImagePipe,
    EventTypeFilterPipe,
    ImagesPipe,
    OccasionFilterPipe,
    PhoneFormatPipe,
    UserImagePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ArrayBuilderPipe,
    BrandFilterPipe,
    CeilPipe,
    CurrencyFilterPipe,
    EventDatePipe,
    EventHostPipe,
    EventImagePipe,
    EventTypeFilterPipe,
    ImagesPipe,
    OccasionFilterPipe,
    PhoneFormatPipe,
    UserImagePipe
  ]
})
export class PipesModule { }
