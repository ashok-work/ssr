import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqsComponent } from './faqs.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    FaqsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: FaqsComponent
      }
    ])
  ]
})
export class FaqsModule { }
