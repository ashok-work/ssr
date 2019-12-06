import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from './transaction-history.component';
import { RouterModule } from '@angular/router';
import { PaginationModule, TabsModule } from 'ngx-bootstrap';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material';
import { TransactionDialogComponent } from './transaction-dialog.component';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';

@NgModule({
  declarations: [
    TransactionHistoryComponent,
    TransactionDialogComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    PipesModule,
    MatTabsModule,
    TabsModule.forRoot(),
    // RouterModule.forChild([
    //   {
    //     path: '', component: TransactionHistoryComponent
    //   }
    // ])
  ],
  entryComponents: [
    TransactionDialogComponent
  ],
  exports: [
    TransactionHistoryComponent
  ]
})
export class TransactionHistoryModule { }
