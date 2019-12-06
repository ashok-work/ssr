import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingBookingsComponent } from './pending-bookings.component';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from '../../ngx-pagination/ngx-pagination.module';

@NgModule({
  declarations: [
    PendingBookingsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    PendingBookingsComponent
  ]
})
export class PendingBookingsModule { }
