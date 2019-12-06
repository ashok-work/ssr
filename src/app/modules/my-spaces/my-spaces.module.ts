import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { MySpacesComponent } from './my-spaces.component';
import { SpaceImagesCarouselModule } from '../space-images-carousel/space-images-carousel.module';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from '../ngx-pagination/ngx-pagination.module';

@NgModule({
  declarations: [
    MySpacesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SpaceImagesCarouselModule,
    PaginationModule.forRoot(),
    NgxPaginationModule,
    RouterModule.forChild([
      {
        path: '', component: MySpacesComponent
      }
    ])
  ]
})
export class MySpacesModule { }
