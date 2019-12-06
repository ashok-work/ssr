import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingRequestsComponent } from './booking-requests.component';
import { RouterModule } from '@angular/router';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HostCancelDialogComponent } from './host-cancel-dialog.component';
import { SpaceImagesCarouselModule } from '../space-images-carousel/space-images-carousel.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PendingRequestsModule } from './pending-requests/pending-requests.module';
import { ApprovedRequestsModule } from './approved-requests/approved-requests.module';
import { CancelledRequestsModule } from './cancelled-requests/cancelled-requests.module';
import { PastRequestsModule } from './past-requests/past-requests.module';

@NgModule({
  declarations: [
    BookingRequestsComponent,
    HostCancelDialogComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SpaceImagesCarouselModule,
    TabsModule.forRoot(),
    PipesModule,
    PendingRequestsModule,
    ApprovedRequestsModule,
    PastRequestsModule,
    CancelledRequestsModule,
    RouterModule.forChild([
      {
        path: '', component: BookingRequestsComponent
      },
      {
        path: ':path_name', component: BookingRequestsComponent
      }
    ])
  ],
  entryComponents: [
    HostCancelDialogComponent
  ]
})
export class BookingRequestsModule { }
