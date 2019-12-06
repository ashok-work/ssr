import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovedRequestsComponent } from './approved-requests.component';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from '../../ngx-pagination/ngx-pagination.module';

@NgModule({
  declarations: [ApprovedRequestsComponent],
  imports: [
    CommonModule,
    PipesModule,
    MaterialModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    ApprovedRequestsComponent
  ]
})
export class ApprovedRequestsModule { }
