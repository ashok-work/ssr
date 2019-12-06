import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PreviewCardModule } from '../preview-card/preview-card.module';
import { PreviewComponent } from './preview.component';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { MaterialModule } from 'src/app/material.module';
import { MakePaymentComponent } from '../../components/booking/make-payment/make-payment.component';
import { CommonComponentsModule } from 'src/app/modules/common-components/common-components.module';

@NgModule({
  declarations: [
    PreviewComponent,
    MakePaymentComponent
  ],
  imports: [
    CommonModule,
    PreviewCardModule,
    CommonComponentsModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: PreviewComponent,
      }
    ])
  ]
})
export class PreviewModule { }
