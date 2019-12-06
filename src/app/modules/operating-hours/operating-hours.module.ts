import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatingHoursComponent } from './operating-hours.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';

@NgModule({
  declarations: [
    OperatingHoursComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    CommonComponentsModule,
    RouterModule.forChild([
      {
        path: ':space_id/:space_name', component: OperatingHoursComponent,
      }
    ])
  ]
})
export class OperatingHoursModule { }
