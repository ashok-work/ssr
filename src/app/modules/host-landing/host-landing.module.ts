import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostLandingComponent } from './host-landing.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common-components/common-components.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  declarations: [
    HostLandingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    LazyLoadImageModule,
    RouterModule.forChild([
      {
        path: '', component: HostLandingComponent
      }
    ])
  ]
})
export class HostLandingModule { }
