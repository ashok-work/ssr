import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: TermsComponent
      }
    ])
  ]
})
export class TermsModule { }
