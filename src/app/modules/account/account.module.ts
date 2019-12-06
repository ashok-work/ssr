import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { RouterModule } from '@angular/router';
import { PayoutPreferencesModule } from '../payout-preferences/payout-preferences.module';
import { TransactionHistoryModule } from '../transaction-history/transaction-history.module';
import { UpgradeProfileModule } from '../upgrade-profile/upgrade-profile.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KycModule } from '../kyc/kyc.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KycModule,
    PayoutPreferencesModule,
    TransactionHistoryModule,
    UpgradeProfileModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: ':page', component: AccountComponent
      },
      {
        path: '', redirectTo: '1', pathMatch: 'full',
      }
    ])
  ]
})
export class AccountModule { }
