import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceImagesCarouselComponent } from './space-images-carousel.component';
import { CarouselModule } from 'ngx-bootstrap';
import { ImagesPipe } from 'src/app/pipes/images.pipe';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';

@NgModule({
  declarations: [
    SpaceImagesCarouselComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    PipesModule,
    CarouselModule.forRoot(),
  ],
  exports: [
    SpaceImagesCarouselComponent
  ]
})
export class SpaceImagesCarouselModule { }
