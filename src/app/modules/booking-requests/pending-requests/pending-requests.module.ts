import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingRequestsComponent } from './pending-requests.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/material.module';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from '../../ngx-pagination/ngx-pagination.module';

@NgModule({
  declarations: [
    PendingRequestsComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    MaterialModule,
    PaginationModule.forRoot(),
    NgxPaginationModule,
  ],
  exports: [
    PendingRequestsComponent
  ]
})
export class PendingRequestsModule { }
