import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

import { SpaceDetailsComponent } from './space-details.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { PlanEventComponent } from './plan-event/plan-event.component';
import { CoverPhotosComponent } from './cover-photos/cover-photos.component';
import { PaginationModule, TooltipModule, BsDropdownModule, CarouselModule } from 'ngx-bootstrap';
import { PreviewCardModule } from '../preview-card/preview-card.module';
import { ShareButtonModule } from '@ngx-share/button';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { CoverPhotosDialogComponent } from './cover-photos/cover-photos-dialog.component';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { FavoritesDialogModule } from '../favorites-dialog/favorites-dialog.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { NgxPaginationModule } from '../ngx-pagination/ngx-pagination.module';

@NgModule({
  declarations: [
    SpaceDetailsComponent,
    MyBookingsComponent,
    PlanEventComponent,
    CoverPhotosComponent,
    CoverPhotosDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonComponentsModule,
    PipesModule,
    FavoritesDialogModule,
    PaginationModule.forRoot(),
    PreviewCardModule,
    ContactFormModule,
    TooltipModule.forRoot(),
    ShareButtonModule,
    ShareButtonsModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    NgxPaginationModule,
    RouterModule.forChild([
      {
        path: '', component: SpaceDetailsComponent
      }
    ])
  ],
  entryComponents: [
    CoverPhotosDialogComponent,
  ]
})
export class SpaceDetailsModule { }
