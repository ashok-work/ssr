import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycComponent } from './kyc.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [KycComponent],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    KycComponent
  ]
})
export class KycModule { }
