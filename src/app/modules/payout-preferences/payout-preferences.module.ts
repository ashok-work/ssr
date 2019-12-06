import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayoutPreferencesComponent } from './payout-preferences.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AddPayoutDialogComponent } from './add-payout-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    PayoutPreferencesComponent,
    AddPayoutDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    // RouterModule.forChild([
    //   {
    //     path: '', component: PayoutPreferencesComponent
    //   }
    // ])
  ],
  entryComponents: [
    AddPayoutDialogComponent
  ],
  exports: [
    PayoutPreferencesComponent
  ]
})
export class PayoutPreferencesModule { }
