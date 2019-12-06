import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { CancelDialogComponent } from './cancel-dialog.component';
import { DescDialogComponent } from './desc-dialog.component';
import { UserBookingsComponent } from './user-bookings.component';
import { AuthGuard } from '../../guards/auth/auth.guard';

import { BarRatingModule } from "ngx-bar-rating";
import { SpaceImagesCarouselModule } from '../space-images-carousel/space-images-carousel.module';
import { PaginationModule } from 'ngx-bootstrap';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PendingBookingsModule } from './pending-bookings/pending-bookings.module';
import { ApprovedBookingsModule } from './approved-bookings/approved-bookings.module';
import { PastBookingsModule } from './past-bookings/past-bookings.module';
import { CancelledBookingsModule } from './cancelled-bookings/cancelled-bookings.module';

@NgModule({
  declarations: [
    CancelDialogComponent,
    DescDialogComponent,
    UserBookingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BarRatingModule,
    PaginationModule.forRoot(),
    CommonComponentsModule,
    PipesModule,
    SpaceImagesCarouselModule,
    PendingBookingsModule,
    ApprovedBookingsModule,
    PastBookingsModule,
    CancelledBookingsModule,
    RouterModule.forChild([
      {
        path: '', component: UserBookingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':path_name', component: UserBookingsComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  entryComponents: [
    CancelDialogComponent,
    DescDialogComponent
  ]
})
export class UserBookingsModule { }
